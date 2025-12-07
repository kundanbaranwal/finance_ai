import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload as UploadIcon,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUploadCSV } from "@/hooks/useApi";

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [parsedCount, setParsedCount] = useState(0);
  const { toast } = useToast();
  const uploadCSVMutation = useUploadCSV();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setUploadStatus("uploading");

    try {
      const response = await uploadCSVMutation.mutateAsync(file);
      const count = response.data.data?.count || response.data.count || 0;
      setParsedCount(count);
      setUploadStatus("success");

      toast({
        title: "File processed successfully",
        description: `${count} transactions have been imported.`,
      });
    } catch (error: any) {
      setUploadStatus("error");
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Failed to process file",
        variant: "destructive",
      });
    }
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type === "text/csv" || file.name.endsWith(".csv")) {
          await processFile(file);
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload a CSV file.",
            variant: "destructive",
          });
        }
      }
    },
    [toast]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
    setParsedCount(0);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Upload Statement</h1>
          <p className="text-muted-foreground">
            Import your bank transactions from a CSV file
          </p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Bank Statement</CardTitle>
            <CardDescription>
              Upload a CSV file with columns: date, description, amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadStatus === "idle" && (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                )}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <UploadIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {isDragging
                        ? "Drop your file here"
                        : "Drag and drop your CSV file"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse from your computer
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
              </div>
            )}

            {uploadStatus === "uploading" && (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-secondary/30 p-12 text-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <div>
                  <p className="text-lg font-medium">Processing file...</p>
                  <p className="text-sm text-muted-foreground">
                    {uploadedFile?.name}
                  </p>
                </div>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-success/30 bg-success/5 p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div>
                  <p className="text-lg font-medium text-success">
                    Upload Successful!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {parsedCount} transactions imported from{" "}
                    {uploadedFile?.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearUpload}>
                    Upload Another
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/transactions")}
                  >
                    View Transactions
                  </Button>
                </div>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <p className="text-lg font-medium text-destructive">
                    Upload Failed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    There was an error processing your file
                  </p>
                </div>
                <Button variant="outline" onClick={clearUpload}>
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expected Format */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expected CSV Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      amount
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm">
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">2024-01-15</td>
                    <td className="px-4 py-3">Starbucks Coffee</td>
                    <td className="px-4 py-3">-5.50</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3">2024-01-14</td>
                    <td className="px-4 py-3">Monthly Salary</td>
                    <td className="px-4 py-3">3500.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">2024-01-13</td>
                    <td className="px-4 py-3">Amazon Purchase</td>
                    <td className="px-4 py-3">-89.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <FileSpreadsheet className="mr-1 inline h-4 w-4" />
              Negative amounts represent expenses, positive amounts represent
              income.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
