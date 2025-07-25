import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { InvoiceData } from '../types/invoice';

interface ExportControlsProps {
  invoices: InvoiceData[];
  fileName?: string;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ 
  invoices, 
  fileName = 'invoices' 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = async () => {
    if (invoices.length === 0) return;
    
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${fileName}_${timestamp}.xlsx`;
      exportToExcel(invoices, filename);
    } catch (error) {
      console.error('Export to Excel failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (invoices.length === 0) return;
    
    setIsExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${fileName}_${timestamp}.csv`;
      exportToCSV(invoices, filename);
    } catch (error) {
      console.error('Export to CSV failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const totalAmount = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
  const currencies = [...new Set(invoices.map(inv => inv.currency || 'USD'))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{invoices.length}</div>
            <div className="text-sm text-muted-foreground">Total Invoices</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencies[0] || 'USD',
              }).format(totalAmount)}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
          </div>
          <div className="text-center">
            <div className="flex justify-center space-x-1 mb-1">
              {currencies.map(currency => (
                <Badge key={currency} variant="secondary" className="text-xs">
                  {currency}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">Currencies</div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleExportExcel}
              disabled={invoices.length === 0 || isExporting}
              className="flex-1 h-12"
              size="lg"
            >
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Export to Excel (.xlsx)
            </Button>
            
            <Button
              onClick={handleExportCSV}
              disabled={invoices.length === 0 || isExporting}
              variant="outline"
              className="flex-1 h-12"
              size="lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Export to CSV
            </Button>
          </div>

          {invoices.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Upload and process invoice files to enable export functionality
            </p>
          )}

          {invoices.length > 0 && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Files will be named with current date</span>
              </div>
              <div>• Excel export includes separate sheets for invoices and line items</div>
              <div>• CSV export contains flattened invoice data with item details</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};