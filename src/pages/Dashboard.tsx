
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Vote, TrendingUp, Activity, Plus } from 'lucide-react';
import { CreateDAOModal } from '@/components/dao/CreateDAOModal';
import { AIVotingConfig } from '@/components/ai/AIVotingConfig';
import { IdentityMinting } from '@/components/identity/IdentityMinting';
import { useGovernanceToken, useDAOFactory, useSoulboundIdentityNFT } from '@/hooks/useContracts';
import { formatEther } from 'viem';

const Dashboard = () => {
  const { balance, votingPower } = useGovernanceToken();
  const { allDAOs } = useDAOFactory();
  const { isVerified } = useSoulboundIdentityNFT();

  const formatTokenAmount = (amount: bigint | undefined) => {
    if (!amount) return '0';
    return Number(formatEther(amount)).toLocaleString(undefined, {
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Governance Dashboard</h1>
            <p className="text-muted-foreground">Monitor your DAO activities and governance participation</p>
          </div>
          <CreateDAOModal />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cosmic-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total DAOs</p>
                <p className="text-2xl font-bold text-primary">
                  {allDAOs && Array.isArray(allDAOs) ? allDAOs.length : 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="cosmic-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Token Balance</p>
                <p className="text-2xl font-bold text-accent">
                  {formatTokenAmount(balance)}
                </p>
              </div>
              <Vote className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card className="cosmic-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Voting Power</p>
                <p className="text-2xl font-bold text-governance">
                  {formatTokenAmount(votingPower)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-governance" />
            </div>
          </Card>

          <Card className="cosmic-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Participation</p>
                <p className="text-2xl font-bold text-success">94%</p>
              </div>
              <Activity className="w-8 h-8 text-success" />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Identity Verification & AI Configuration */}
          <div className="space-y-6">
            <IdentityMinting />
            <AIVotingConfig />
          </div>

          {/* Recent DAOs */}
          <Card className="cosmic-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Recent DAOs
            </h2>
            <div className="space-y-4">
              {allDAOs && Array.isArray(allDAOs) && allDAOs.length > 0 ? (
                allDAOs.slice(0, 3).map((dao: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{dao.name}</h3>
                      <Badge variant="outline">
                        {Number(dao.memberCount)} members
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{Number(dao.proposalCount)} proposals</span>
                      <span>Created {new Date(Number(dao.createdAt) * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No DAOs found. Create your first DAO to get started!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
