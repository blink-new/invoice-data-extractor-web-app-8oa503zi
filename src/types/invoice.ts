export interface InvoiceData {
  id?: string;
  invoiceNumber?: string;
  date?: string;
  dueDate?: string;
  vendor?: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  customer?: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  items?: Array<{
    description?: string;
    quantity?: number;
    unitPrice?: number;
    total?: number;
  }>;
  subtotal?: number;
  tax?: number;
  total?: number;
  currency?: string;
  status?: string;
  [key: string]: any; // Allow for additional fields
}

export interface ProcessedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  data: InvoiceData[];
  status: 'processing' | 'completed' | 'error';
  error?: string;
}