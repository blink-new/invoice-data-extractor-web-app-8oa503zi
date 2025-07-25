import React, { useState, useCallback } from 'react';
import { FileText, Database } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { InvoiceTable } from './components/InvoiceTable';
import { ExportControls } from './components/ExportControls';
import { FileHistory } from './components/FileHistory';
import { ProcessedFile, InvoiceData } from './types/invoice';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';

function App() {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileProcessed = useCallback((file: ProcessedFile) => {
    setProcessedFiles(prev => [file, ...prev]);
    setSelectedFile(file);
    
    toast({
      title: "File processed successfully",
      description: `Found ${file.data.length} invoices in ${file.name}`,
    });
  }, [toast]);

  const handleFileSelect = useCallback((file: ProcessedFile) => {
    setSelectedFile(file);
  }, []);

  const handleFileDelete = useCallback((fileId: string) => {
    setProcessedFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (selectedFile?.id === fileId) {
      const remainingFiles = processedFiles.filter(f => f.id !== fileId);
      setSelectedFile(remainingFiles.length > 0 ? remainingFiles[0] : null);
    }

    toast({
      title: "File deleted",
      description: "File has been removed from history",
    });
  }, [selectedFile, processedFiles, toast]);

  const currentInvoices: InvoiceData[] = selectedFile?.data || [];
  const currentFileName = selectedFile?.name.replace('.json', '') || 'invoices';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoice Data Extractor</h1>
              <p className="text-sm text-muted-foreground">
                Upload JSON files and export structured invoice data
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - File Management */}
          <div className="lg:col-span-1 space-y-6">
            <FileHistory
              files={processedFiles}
              onFileSelect={handleFileSelect}
              onFileDelete={handleFileDelete}
              selectedFileId={selectedFile?.id}
            />
            
            <ExportControls
              invoices={currentInvoices}
              fileName={currentFileName}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upload Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Upload Invoice Data</h2>
              </div>
              <FileUpload
                onFileProcessed={handleFileProcessed}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>

            {/* Data Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Invoice Data</h2>
                </div>
                {selectedFile && (
                  <div className="text-sm text-muted-foreground">
                    Showing data from: <span className="font-medium">{selectedFile.name}</span>
                  </div>
                )}
              </div>
              <InvoiceTable invoices={currentInvoices} />
            </div>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}

export default App;