import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAIOracle } from '@/hooks/useContracts';

interface ProposalAnalysisProps {
  proposalId?: string;
}

export const ProposalAnalysis = ({ proposalId: initialProposalId }: ProposalAnalysisProps) => {
  const [proposalId, setProposalId] = useState(initialProposalId || '');
  const [analyzed, setAnalyzed] = useState(false);
  const { getAnalysis, getPrediction } = useAIOracle();

  const handleAnalyze = () => {
    if (!proposalId.trim()) return;
    setAnalyzed(true);
  };

  // Get analysis and prediction data
  const analysisQuery = analyzed ? getAnalysis(proposalId) : { data: null };
  const predictionQuery = analyzed ? getPrediction(proposalId) : { data: null };

  return (
    <Card className="cosmic-card p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">AI Proposal Analysis</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposalId">Proposal ID</Label>
          <div className="flex gap-2">
            <Input
              id="proposalId"
              placeholder="Enter proposal ID or hash..."
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
            />
            <Button onClick={handleAnalyze} disabled={!proposalId.trim()}>
              Analyze
            </Button>
          </div>
        </div>

        {analysisQuery.data && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium mb-2">Analysis Summary</h4>
              <p className="text-sm text-muted-foreground">
                {analysisQuery.data.summary}
              </p>
              
              <div className="flex gap-2 mt-3">
                {analysisQuery.data.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <div className="flex items-center justify-center mb-1">
                  <BarChart3 className="w-4 h-4 text-governance" />
                </div>
                <p className="text-sm font-medium">
                  {Number(analysisQuery.data.complexityScore)}/100
                </p>
                <p className="text-xs text-muted-foreground">Complexity</p>
              </div>
              
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <div className="flex items-center justify-center mb-1">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <p className="text-sm font-medium">
                  {Number(analysisQuery.data.riskScore)}/100
                </p>
                <p className="text-xs text-muted-foreground">Risk Score</p>
              </div>
            </div>
          </div>
        )}

        {predictionQuery.data && predictionQuery.data.isValid && (
          <div className="p-4 bg-accent/10 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-accent" />
              Voting Prediction
            </h4>
            <p className="text-sm mb-2">
              <span className="font-medium">Confidence:</span> {Number(predictionQuery.data.confidenceScore)}%
            </p>
            <p className="text-sm mb-2">
              <span className="font-medium">Predicted Outcome:</span> {
                Number(predictionQuery.data.predictedOutcome) === 1 ? 'Pass' : 'Fail'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {predictionQuery.data.reasoning}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};