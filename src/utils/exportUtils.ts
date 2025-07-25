import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { InvoiceData } from '../types/invoice';

export const exportToExcel = (invoices: InvoiceData[], filename: string = 'invoices.xlsx') => {
  // Flatten the data for Excel export
  const flattenedData = invoices.map(invoice => ({
    'Invoice Number': invoice.invoiceNumber || '',
    'Date': invoice.date || '',
    'Due Date': invoice.dueDate || '',
    'Vendor Name': invoice.vendor?.name || '',
    'Vendor Address': invoice.vendor?.address || '',
    'Vendor Email': invoice.vendor?.email || '',
    'Vendor Phone': invoice.vendor?.phone || '',
    'Customer Name': invoice.customer?.name || '',
    'Customer Address': invoice.customer?.address || '',
    'Customer Email': invoice.customer?.email || '',
    'Customer Phone': invoice.customer?.phone || '',
    'Subtotal': invoice.subtotal || 0,
    'Tax': invoice.tax || 0,
    'Total': invoice.total || 0,
    'Currency': invoice.currency || 'USD',
    'Status': invoice.status || '',
    'Items Count': invoice.items?.length || 0,
    'Items Details': invoice.items?.map(item => 
      `${item.description || 'N/A'} (Qty: ${item.quantity || 0}, Price: ${item.unitPrice || 0}, Total: ${item.total || 0})`
    ).join('; ') || ''
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(flattenedData);

  // Auto-size columns
  const colWidths = Object.keys(flattenedData[0] || {}).map(key => ({
    wch: Math.max(key.length, 15)
  }));
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices');

  // Create items detail sheet if there are items
  const allItems = invoices.flatMap((invoice, invoiceIndex) => 
    (invoice.items || []).map((item, itemIndex) => ({
      'Invoice Number': invoice.invoiceNumber || '',
      'Item Index': itemIndex + 1,
      'Description': item.description || '',
      'Quantity': item.quantity || 0,
      'Unit Price': item.unitPrice || 0,
      'Total': item.total || 0
    }))
  );

  if (allItems.length > 0) {
    const itemsWs = XLSX.utils.json_to_sheet(allItems);
    XLSX.utils.book_append_sheet(wb, itemsWs, 'Items');
  }

  // Save file
  XLSX.writeFile(wb, filename);
};

export const exportToCSV = (invoices: InvoiceData[], filename: string = 'invoices.csv') => {
  // Flatten the data for CSV export
  const flattenedData = invoices.map(invoice => ({
    'Invoice Number': invoice.invoiceNumber || '',
    'Date': invoice.date || '',
    'Due Date': invoice.dueDate || '',
    'Vendor Name': invoice.vendor?.name || '',
    'Vendor Address': invoice.vendor?.address || '',
    'Vendor Email': invoice.vendor?.email || '',
    'Vendor Phone': invoice.vendor?.phone || '',
    'Customer Name': invoice.customer?.name || '',
    'Customer Address': invoice.customer?.address || '',
    'Customer Email': invoice.customer?.email || '',
    'Customer Phone': invoice.customer?.phone || '',
    'Subtotal': invoice.subtotal || 0,
    'Tax': invoice.tax || 0,
    'Total': invoice.total || 0,
    'Currency': invoice.currency || 'USD',
    'Status': invoice.status || '',
    'Items Count': invoice.items?.length || 0,
    'Items Details': invoice.items?.map(item => 
      `${item.description || 'N/A'} (Qty: ${item.quantity || 0}, Price: ${item.unitPrice || 0}, Total: ${item.total || 0})`
    ).join('; ') || ''
  }));

  // Convert to CSV
  const csv = Papa.unparse(flattenedData);

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};