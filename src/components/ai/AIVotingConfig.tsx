
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings, Zap, Loader2 } from 'lucide-react';
import { useAIVotingModule } from '@/hooks/useContracts';
import { useToast } from '@/hooks/use-toast';

export const AIVotingConfig = () => {
  const { aiConfig, configureAIVoting } = useAIVotingModule();
  const { toast } = useToast();
  
  const [enabled, setEnabled] = useState(aiConfig?.[0] || false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(
    aiConfig?.[1] ? Number(aiConfig[1]) : 75
  );
  const [votingDelay, setVotingDelay] = useState(
    aiConfig?.[2] ? Number(aiConfig[2]) : 24
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveConfig = async () => {
    try {
      setIsLoading(true);
      console.log('Attempting to configure AI voting:', {
        enabled,
        confidenceThreshold,
        votingDelay
      });

      const txHash = await configureAIVoting(
        enabled,
        BigInt(confidenceThreshold),
        BigInt(votingDelay)
      );
      
      console.log('AI voting configuration transaction submitted:', txHash);
      
      toast({
        title: "Transaction Submitted",
        description: "Your AI voting configuration transaction has been submitted. Please check your wallet.",
      });
    } catch (error: any) {
      console.error('Configuration error:', error);
      toast({
        title: "Failed to Save Configuration",
        description: error.message || error.reason || "Please check your wallet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="cosmic-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Bot className="w-6 h-6 mr-3 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">Daisy - AI Voting Agent</h3>
            <p className="text-sm text-muted-foreground">Configure automated voting preferences</p>
          </div>
        </div>
        <Badge variant={enabled ? "default" : "secondary"}>
          {enabled ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="ai-enabled" className="text-base font-medium">
              Enable AI Voting
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow Daisy to vote on your behalf based on your preferences
            </p>
          </div>
          <Switch
            id="ai-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="confidence">
                Minimum Confidence Threshold ({confidenceThreshold}%)
              </Label>
              <Input
                id="confidence"
                type="range"
                min="0"
                max="100"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="slider"
              />
              <p className="text-xs text-muted-foreground">
                Daisy will only vote when confidence is above this threshold
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delay">Voting Delay (hours)</Label>
              <Input
                id="delay"
                type="number"
                min="1"
                max="168"
                value={votingDelay}
                onChange={(e) => setVotingDelay(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Time to wait before executing automated votes
              </p>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="w-4 h-4 mr-2 text-accent" />
                <span className="font-medium">Daisy's Capabilities</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Analyzes proposal content and sentiment</li>
                <li>• Considers historical voting patterns</li>
                <li>• Evaluates risk and complexity scores</li>
                <li>• Follows your category preferences</li>
              </ul>
            </div>
          </>
        )}

        <Button 
          onClick={handleSaveConfig} 
          disabled={isLoading}
          className="w-full glow"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving Configuration...
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
