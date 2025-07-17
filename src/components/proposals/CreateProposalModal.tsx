import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Clock, Users, Brain } from 'lucide-react';
import { useProposalRegistry, useProposalMetadata } from '@/hooks/useContracts';
import { useToast } from '@/hooks/use-toast';

interface CreateProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  daoAddress?: string;
}

const categories = [
  'Treasury',
  'Governance',
  'Technical',
  'Community',
  'Partnership',
  'Marketing',
  'Other'
];

export const CreateProposalModal = ({ open, onOpenChange, daoAddress }: CreateProposalModalProps) => {
  const [step, setStep] = useState(1);
  const { registerProposal } = useProposalRegistry();
  const { storeProposalMetadata } = useProposalMetadata();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    enableAIVoting: false,
    tags: [] as string[],
    newTag: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreateProposal = async () => {
    try {
      console.log('Creating proposal with form data:', formData);
      console.log('DAO Address:', daoAddress);
      
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill in title, description, and category.",
          variant: "destructive",
        });
        return;
      }

      if (!daoAddress) {
        toast({
          title: "No DAO Selected",
          description: "Please select a DAO first.",
          variant: "destructive",
        });
        return;
      }

      // Generate a unique proposal ID
      const proposalId = Date.now();
      const deadline = Math.floor(formData.deadline.getTime() / 1000); // Convert to Unix timestamp
      const aiConfidenceScore = formData.enableAIVoting ? Math.floor(Math.random() * 30) + 70 : 0;

      console.log('Proposal data:', {
        dao: daoAddress,
        proposalId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        deadline,
        aiConfidenceScore,
      });

      // Register the proposal
      await registerProposal({
        dao: daoAddress,
        proposalId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        deadline,
        aiConfidenceScore,
      });

      console.log('Proposal registered successfully');

      // Store additional metadata if needed
      if (formData.tags.length > 0 || formData.enableAIVoting) {
        await storeProposalMetadata({
          proposalId,
          tags: formData.tags,
          aiConfidenceScore,
          enableAIVoting: formData.enableAIVoting,
        });
        console.log('Proposal metadata stored successfully');
      }

      toast({
        title: "Proposal Created Successfully!",
        description: `${formData.title} has been submitted for voting.`,
      });

      onOpenChange(false);
      setStep(1);
      setFormData({
        title: '',
        description: '',
        category: '',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        enableAIVoting: false,
        tags: [],
        newTag: '',
      });
    } catch (error) {
      console.error('Proposal creation error:', error);
      toast({
        title: "Failed to Create Proposal",
        description: error instanceof Error ? error.message : "Please check your inputs and try again.",
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
              <Label htmlFor="title">Proposal Title</Label>
              <Input
                id="title"
                placeholder="Enter a clear, descriptive title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your proposal..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Voting Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => date && handleInputChange('deadline', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={formData.newTag}
                  onChange={(e) => handleInputChange('newTag', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable AI Voting</Label>
                  <div className="text-sm text-muted-foreground">
                    Allow AI agents to vote based on your preferences
                  </div>
                </div>
                <Switch
                  checked={formData.enableAIVoting}
                  onCheckedChange={(checked) => handleInputChange('enableAIVoting', checked)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = ['Proposal Details', 'Settings & Timeline'];
  const stepIcons = [Users, Clock];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="cosmic-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Create New Proposal</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </Button>
          </div>

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

          <div className="space-y-6">
            {renderStep()}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 2 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!formData.title || !formData.description || !formData.category}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleCreateProposal} className="glow">
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};