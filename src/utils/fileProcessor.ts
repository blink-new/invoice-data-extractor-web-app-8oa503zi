import { InvoiceData } from '../types/invoice';

export const processJsonFile = async (file: File): Promise<InvoiceData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const jsonData = JSON.parse(content);
        
        // Handle different JSON structures
        let invoices: InvoiceData[] = [];
        
        if (Array.isArray(jsonData)) {
          invoices = jsonData;
        } else if (jsonData.invoices && Array.isArray(jsonData.invoices)) {
          invoices = jsonData.invoices;
        } else if (jsonData.data && Array.isArray(jsonData.data)) {
          invoices = jsonData.data;
        } else {
          // Single invoice object
          invoices = [jsonData];
        }
        
        // Normalize the data structure
        const normalizedInvoices = invoices.map((invoice, index) => ({
          id: invoice.id || `invoice-${index + 1}`,
          invoiceNumber: invoice.invoiceNumber || invoice.invoice_number || invoice.number || `INV-${index + 1}`,
          date: invoice.date || invoice.invoice_date || invoice.created_date,
          dueDate: invoice.dueDate || invoice.due_date || invoice.payment_due,
          vendor: {
            name: invoice.vendor?.name || invoice.supplier?.name || invoice.from?.name,
            address: invoice.vendor?.address || invoice.supplier?.address || invoice.from?.address,
            email: invoice.vendor?.email || invoice.supplier?.email || invoice.from?.email,
            phone: invoice.vendor?.phone || invoice.supplier?.phone || invoice.from?.phone,
          },
          customer: {
            name: invoice.customer?.name || invoice.client?.name || invoice.to?.name,
            address: invoice.customer?.address || invoice.client?.address || invoice.to?.address,
            email: invoice.customer?.email || invoice.client?.email || invoice.to?.email,
            phone: invoice.customer?.phone || invoice.client?.phone || invoice.to?.phone,
          },
          items: invoice.items || invoice.line_items || invoice.products || [],
          subtotal: invoice.subtotal || invoice.sub_total || invoice.amount_before_tax,
          tax: invoice.tax || invoice.tax_amount || invoice.vat,
          total: invoice.total || invoice.total_amount || invoice.grand_total,
          currency: invoice.currency || 'USD',
          status: invoice.status || 'pending',
          ...invoice // Include any additional fields
        }));
        
        resolve(normalizedInvoices);
      } catch (error) {
        reject(new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

export const validateJsonFile = (file: File): string | null => {
  if (!file.type.includes('json') && !file.name.endsWith('.json')) {
    return 'Please upload a valid JSON file';
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return 'File size must be less than 10MB';
  }
  
  return null;
};