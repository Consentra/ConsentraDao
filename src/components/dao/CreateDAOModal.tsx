
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Users, Settings, Coins } from 'lucide-react';
import { useDAOFactory } from '@/hooks/useContracts';
import { useToast } from '@/hooks/use-toast';

export const CreateDAOModal = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const { createDAO } = useDAOFactory();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tokenName: '',
    tokenSymbol: '',
    initialSupply: '',
    votingDelay: '1',
    votingPeriod: '7',
    proposalThreshold: '1000',
    quorumPercentage: '4',
    timelockDelay: '2',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateDAO = async () => {
    try {
      console.log('Creating DAO with form data:', formData);
      
      // Validate required fields
      if (!formData.name || !formData.tokenName || !formData.tokenSymbol) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const config = {
        name: formData.name,
        tokenName: formData.tokenName,
        tokenSymbol: formData.tokenSymbol,
        initialSupply: BigInt(formData.initialSupply || '1000000'),
        votingDelay: BigInt(formData.votingDelay),
        votingPeriod: BigInt(formData.votingPeriod),
        proposalThreshold: BigInt(formData.proposalThreshold),
        quorumPercentage: BigInt(formData.quorumPercentage),
        timelockDelay: BigInt(formData.timelockDelay),
      };

      console.log('DAO config:', config);
      
      const result = await createDAO(config);
      console.log('DAO creation result:', result);
      
      toast({
        title: "DAO Created Successfully!",
        description: `${formData.name} has been deployed to the blockchain.`,
      });
      
      setOpen(false);
      setStep(1);
    } catch (error) {
      console.error('DAO creation error:', error);
      toast({
        title: "Failed to Create DAO",
        description: error instanceof Error ? error.message : "Please check your wallet connection and try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">DAO Name</Label>
              <Input
                id="name"
                placeholder="Enter DAO name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your DAO's purpose and goals"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tokenName">Token Name</Label>
                <Input
                  id="tokenName"
                  placeholder="e.g., MyDAO Token"
                  value={formData.tokenName}
                  onChange={(e) => handleInputChange('tokenName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Token Symbol</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="e.g., MDAO"
                  value={formData.tokenSymbol}
                  onChange={(e) => handleInputChange('tokenSymbol', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="initialSupply">Initial Supply</Label>
              <Input
                id="initialSupply"
                type="number"
                placeholder="1000000"
                value={formData.initialSupply}
                onChange={(e) => handleInputChange('initialSupply', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="votingDelay">Voting Delay (days)</Label>
                <Input
                  id="votingDelay"
                  type="number"
                  value={formData.votingDelay}
                  onChange={(e) => handleInputChange('votingDelay', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="votingPeriod">Voting Period (days)</Label>
                <Input
                  id="votingPeriod"
                  type="number"
                  value={formData.votingPeriod}
                  onChange={(e) => handleInputChange('votingPeriod', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposalThreshold">Proposal Threshold</Label>
                <Input
                  id="proposalThreshold"
                  type="number"
                  value={formData.proposalThreshold}
                  onChange={(e) => handleInputChange('proposalThreshold', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quorumPercentage">Quorum (%)</Label>
                <Input
                  id="quorumPercentage"
                  type="number"
                  max="100"
                  value={formData.quorumPercentage}
                  onChange={(e) => handleInputChange('quorumPercentage', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = ['Basic Info', 'Token Settings', 'Governance'];
  const stepIcons = [Users, Coins, Settings];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="glow">
          <Plus className="w-4 h-4 mr-2" />
          Create DAO
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New DAO</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {stepTitles.map((title, index) => {
            const StepIcon = stepIcons[index];
            const isActive = step === index + 1;
            const isCompleted = step > index + 1;
            
            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive ? 'bg-primary border-primary text-primary-foreground' :
                  isCompleted ? 'bg-success border-success text-success-foreground' :
                  'bg-muted border-muted-foreground text-muted-foreground'
                }`}>
                  <StepIcon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {title}
                </span>
                {index < stepTitles.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-success' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>

        <Card className="p-6">
          {renderStep()}
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleCreateDAO} className="glow">
              Create DAO
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
