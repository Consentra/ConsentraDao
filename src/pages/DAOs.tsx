import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Plus, TrendingUp, Vote, DollarSign } from 'lucide-react';
import { CreateDAOModal } from '@/components/dao/CreateDAOModal';
import { useDAOFactory } from '@/hooks/useContracts';

const DAOs = () => {
  const { allDAOs } = useDAOFactory();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Discover DAOs</h1>
            <p className="text-muted-foreground">Explore and join decentralized autonomous organizations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search DAOs..." className="pl-10 w-64" />
            </div>
            <CreateDAOModal />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "DeFi", "Gaming", "Social", "Creator", "Infrastructure"].map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
              className={category === "All" ? "glow" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* DAOs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDAOs && Array.isArray(allDAOs) && allDAOs.length > 0 ? (
            allDAOs.map((dao: any, index: number) => (
              <Card key={index} className="cosmic-card p-6 hover:glow-accent transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{dao.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Governance</Badge>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  Decentralized governance token for {dao.name} community
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{Number(dao.memberCount)}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Vote className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-sm font-medium">{Number(dao.proposalCount)}</p>
                    <p className="text-xs text-muted-foreground">Proposals</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="w-4 h-4 text-governance" />
                    </div>
                    <p className="text-sm font-medium">Active</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    Join DAO
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No DAOs Found</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to create a DAO in the Consentra ecosystem!
              </p>
              <CreateDAOModal />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DAOs;
