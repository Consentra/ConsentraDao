import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, CheckCircle, Upload, AlertCircle, FileText, X } from 'lucide-react';
import { useSoulboundIdentityNFT } from '@/hooks/useContracts';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

export const IdentityMinting = () => {
  const { address } = useAccount();
  const { isVerified, identity, mintIdentity } = useSoulboundIdentityNFT();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [verificationHash, setVerificationHash] = useState('');
  const [metadataURI, setMetadataURI] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type. Please upload JPEG, PNG, or PDF files.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is too large. Please upload files smaller than 10MB.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processDocuments = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Documents",
        description: "Please upload at least one verification document.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Convert files to base64
      const filePromises = uploadedFiles.map(file => {
        return new Promise<{name: string; type: string; data: string}>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve({
              name: file.name,
              type: file.type,
              data: base64.split(',')[1] // Remove data:type;base64, prefix
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const processedFiles = await Promise.all(filePromises);

      // Call the edge function to process documents
      const { data, error } = await supabase.functions.invoke('process-identity-documents', {
        body: {
          files: processedFiles,
          userAddress: address
        }
      });

      if (error) throw error;

      if (data.success) {
        setVerificationHash(data.verificationHash);
        setMetadataURI(data.metadataURI);
        setProcessingComplete(true);
        
        toast({
          title: "Documents Processed",
          description: "Your verification documents have been processed successfully!",
        });
      } else {
        throw new Error(data.error || 'Processing failed');
      }

    } catch (error: any) {
      console.error('Document processing error:', error);
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMintIdentity = async () => {
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint identity.",
        variant: "destructive",
      });
      return;
    }

    if (!verificationHash || !metadataURI) {
      toast({
        title: "Missing Information",
        description: "Please process your documents first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting to mint identity:', {
        address,
        verificationHash,
        metadataURI
      });

      const txHash = await mintIdentity(verificationHash, metadataURI);
      console.log('Identity minting transaction submitted:', txHash);
      
      toast({
        title: "Transaction Submitted",
        description: "Your identity minting transaction has been submitted. Please check your wallet.",
      });

      // Reset form
      setUploadedFiles([]);
      setVerificationHash('');
      setMetadataURI('');
      setProcessingComplete(false);
    } catch (error: any) {
      console.error('Minting error:', error);
      toast({
        title: "Failed to Mint Identity",
        description: error.message || error.reason || "Please check your wallet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <Card className="cosmic-card p-6">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Connect Wallet Required</h3>
          <p className="text-muted-foreground">
            Please connect your wallet to manage your Soulbound Identity NFT.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="cosmic-card p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Soulbound Identity NFT</h2>
          {isVerified ? (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Not Verified
            </Badge>
          )}
        </div>

        {isVerified ? (
          <div className="space-y-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-medium text-success mb-2">Identity Verified</h4>
              <p className="text-sm text-muted-foreground">
                Your Soulbound Identity NFT has been minted and verified. This gives you access to all DAO features.
              </p>
            </div>
            
            {identity && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Verification Hash</Label>
                  <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">
                    {identity.verificationHash}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Metadata URI</Label>
                  <p className="text-sm text-muted-foreground mt-1 break-all">
                    {identity.metadataURI}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Minted</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(Number(identity.timestamp) * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Document Upload Section */}
            <div className="space-y-4">
              <div>
                <Label>Upload Verification Documents</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload identity documents (ID, passport, driver's license)
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    Choose Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported: JPEG, PNG, PDF (Max 10MB each)
                  </p>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents ({uploadedFiles.length})</Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isProcessing}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Documents Button */}
              {uploadedFiles.length > 0 && !processingComplete && (
                <Button 
                  onClick={processDocuments} 
                  disabled={isProcessing}
                  className="w-full"
                  variant="outline"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Documents...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Process Documents
                    </>
                  )}
                </Button>
              )}

              {/* Processing Results */}
              {processingComplete && verificationHash && metadataURI && (
                <div className="space-y-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center text-success">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Documents Processed Successfully</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Verification Hash:</span>
                      <p className="font-mono text-xs text-muted-foreground break-all">
                        {verificationHash}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Metadata URI:</span>
                      <p className="text-xs text-muted-foreground break-all">
                        {metadataURI}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mint Button - Only show when processing is complete */}
            {processingComplete && (
              <Button 
                onClick={handleMintIdentity} 
                disabled={isLoading || !verificationHash || !metadataURI}
                className="w-full glow"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Minting Identity NFT...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Mint Identity NFT
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};