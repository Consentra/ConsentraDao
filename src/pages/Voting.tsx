import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Vote, 
  Users, 
  Calendar, 
  TrendingUp, 
  Brain, 
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { CreateProposalModal } from '@/components/proposals/CreateProposalModal';
import { useProposalRegistry } from '@/hooks/useContracts';

const categories = ['All', 'Treasury', 'Governance', 'Technical', 'Community', 'Partnership', 'Marketing'];

export default function Voting() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { allProposals, getProposalsByCategory } = useProposalRegistry();

  const filteredProposals = selectedCategory === 'All' 
    ? allProposals 
    : getProposalsByCategory(selectedCategory);

  const searchedProposals = filteredProposals.filter(proposal =>
    proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeRemaining = (deadline: bigint) => {
    const now = Date.now();
    const deadlineMs = Number(deadline) * 1000; // Convert seconds to milliseconds
    const timeLeft = deadlineMs - now;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    if (timeLeft > 0) return 'Less than 1h';
    return 'Ended';
  };

  const getStatusColor = (proposal: any) => {
    const deadlineMs = Number(proposal.deadline) * 1000;
    const timeLeft = deadlineMs - Date.now();
    if (timeLeft <= 0) return 'text-muted-foreground';
    if (timeLeft < 24 * 60 * 60 * 1000) return 'text-destructive'; // Less than 1 day
    return 'text-success';
  };

  const getVotePercentage = (votesFor: number, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votesFor / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Governance Proposals</h1>
          <p className="text-muted-foreground">
            Participate in DAO governance by voting on active proposals
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="glow">
          <Plus className="w-4 h-4 mr-2" />
          Create Proposal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cosmic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Proposals</p>
              <p className="text-2xl font-bold text-primary">
                {allProposals.filter(p => p.isActive).length}
              </p>
            </div>
            <Vote className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="cosmic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Proposals</p>
              <p className="text-2xl font-bold text-primary">
                {allProposals.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="cosmic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Deadline</p>
              <p className="text-2xl font-bold text-primary">
                {allProposals.length > 0 ? Math.round(allProposals.reduce((sum, p) => sum + Number(p.deadline), 0) / allProposals.length / 86400) : 0}d
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="cosmic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold text-primary">
                {new Set(allProposals.map(p => p.category)).size}
              </p>
            </div>
            <Brain className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid gap-6">
        {searchedProposals.length > 0 ? (
          searchedProposals.map((proposal, index) => (
            <Card key={index} className="cosmic-card p-6 hover:glow-accent transition-all duration-300">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{proposal.category}</Badge>
                      <Badge 
                        variant={proposal.isActive ? "default" : "secondary"}
                        className={proposal.isActive ? "glow" : ""}
                      >
                        {proposal.isActive ? "Active" : "Ended"}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{proposal.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {proposal.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-1 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      <span className={getStatusColor(proposal)}>
                        {formatTimeRemaining(proposal.deadline)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(Number(proposal.createdAt) * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Proposal Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Proposal ID</span>
                      <span className="text-sm font-medium">
                        #{Number(proposal.proposalId)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className={`text-sm font-medium ${proposal.isActive ? 'text-success' : 'text-muted-foreground'}`}>
                        {proposal.isActive ? 'Active' : 'Ended'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">DAO</span>
                      <span className="text-sm font-medium truncate">
                        {proposal.dao.slice(0, 6)}...{proposal.dao.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {new Date(Number(proposal.createdAt) * 1000).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Ends {new Date(Number(proposal.deadline) * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {proposal.isActive && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                        <XCircle className="w-4 h-4 mr-1" />
                        Against
                      </Button>
                      <Button size="sm" className="text-success hover:bg-success/10">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        For
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="cosmic-card p-12 text-center">
            <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Proposals Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to create a proposal!'}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Proposal
            </Button>
          </Card>
        )}
      </div>

      <CreateProposalModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
      </main>
    </div>
  );
}