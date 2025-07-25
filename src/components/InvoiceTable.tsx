import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Eye, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { InvoiceData } from '../types/invoice';

interface InvoiceTableProps {
  invoices: InvoiceData[];
}

type SortField = keyof InvoiceData | 'vendor.name' | 'customer.name';
type SortDirection = 'asc' | 'desc';

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortField === 'vendor.name') {
        aValue = a.vendor?.name || '';
        bValue = b.vendor?.name || '';
      } else if (sortField === 'customer.name') {
        aValue = a.customer?.name || '';
        bValue = b.customer?.name || '';
      } else {
        aValue = a[sortField as keyof InvoiceData] || '';
        bValue = b[sortField as keyof InvoiceData] || '';
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [invoices, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const formatCurrency = (amount: number | undefined, currency: string = 'USD') => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No invoices found</h3>
          <p className="text-muted-foreground">Upload a JSON file to see invoice data here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Invoice Data ({invoices.length} invoices)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('invoiceNumber')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Invoice #</span>
                    <SortIcon field="invoiceNumber" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <SortIcon field="date" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('vendor.name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Vendor</span>
                    <SortIcon field="vendor.name" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('customer.name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Customer</span>
                    <SortIcon field="customer.name" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Total</span>
                    <SortIcon field="total" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <SortIcon field="status" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvoices.map((invoice, index) => (
                <TableRow key={invoice.id || index}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {invoice.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.vendor?.name || 'N/A'}</div>
                      {invoice.vendor?.email && (
                        <div className="text-sm text-muted-foreground">{invoice.vendor.email}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.customer?.name || 'N/A'}</div>
                      {invoice.customer?.email && (
                        <div className="text-sm text-muted-foreground">{invoice.customer.email}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Invoice Details - {invoice.invoiceNumber}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Invoice Information</h4>
                              <div className="space-y-1 text-sm">
                                <div><strong>Number:</strong> {invoice.invoiceNumber || 'N/A'}</div>
                                <div><strong>Date:</strong> {invoice.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}</div>
                                <div><strong>Due Date:</strong> {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</div>
                                <div><strong>Status:</strong> {invoice.status || 'N/A'}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Financial Summary</h4>
                              <div className="space-y-1 text-sm">
                                <div><strong>Subtotal:</strong> {formatCurrency(invoice.subtotal, invoice.currency)}</div>
                                <div><strong>Tax:</strong> {formatCurrency(invoice.tax, invoice.currency)}</div>
                                <div><strong>Total:</strong> {formatCurrency(invoice.total, invoice.currency)}</div>
                                <div><strong>Currency:</strong> {invoice.currency || 'USD'}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Vendor</h4>
                              <div className="space-y-1 text-sm">
                                <div><strong>Name:</strong> {invoice.vendor?.name || 'N/A'}</div>
                                <div><strong>Email:</strong> {invoice.vendor?.email || 'N/A'}</div>
                                <div><strong>Phone:</strong> {invoice.vendor?.phone || 'N/A'}</div>
                                <div><strong>Address:</strong> {invoice.vendor?.address || 'N/A'}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Customer</h4>
                              <div className="space-y-1 text-sm">
                                <div><strong>Name:</strong> {invoice.customer?.name || 'N/A'}</div>
                                <div><strong>Email:</strong> {invoice.customer?.email || 'N/A'}</div>
                                <div><strong>Phone:</strong> {invoice.customer?.phone || 'N/A'}</div>
                                <div><strong>Address:</strong> {invoice.customer?.address || 'N/A'}</div>
                              </div>
                            </div>
                          </div>

                          {invoice.items && invoice.items.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Items ({invoice.items.length})</h4>
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Description</TableHead>
                                      <TableHead>Qty</TableHead>
                                      <TableHead>Unit Price</TableHead>
                                      <TableHead>Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {invoice.items.map((item, itemIndex) => (
                                      <TableRow key={itemIndex}>
                                        <TableCell>{item.description || 'N/A'}</TableCell>
                                        <TableCell>{item.quantity || 0}</TableCell>
                                        <TableCell>{formatCurrency(item.unitPrice, invoice.currency)}</TableCell>
                                        <TableCell>{formatCurrency(item.total, invoice.currency)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};