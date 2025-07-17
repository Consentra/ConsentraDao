import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Sparkles, Vote, Users, MessageSquare, Shield, Zap } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative py-20 px-4">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-secondary/20 opacity-50 rounded-3xl blur-3xl"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <Badge variant="secondary" className="mb-6 px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          Next-Gen DAO Governance
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-text">Consentra</span>
          <br />
          <span className="text-foreground">Governance Platform</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Experience the future of decentralized governance with AI-powered analysis, 
          soulbound NFT verification, and automated voting agents. 
          Create, analyze, and participate in DAOs with unprecedented transparency and efficiency.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="glow" asChild>
            <Link to="/dashboard">
              <Vote className="w-5 h-5 mr-2" />
              Start Governing
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="border-border/50 hover:border-primary/50" asChild>
            <Link to="/ai-chat">
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat with AI
            </Link>
          </Button>
        </div>
        
        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="cosmic-card p-6 hover:glow-accent transition-all duration-300">
            <Shield className="w-12 h-12 text-governance mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Soulbound NFT Verification</h3>
            <p className="text-muted-foreground">
              One person, one vote. Verified identity through soulbound NFTs ensures fair governance.
            </p>
          </Card>
          
          <Card className="cosmic-card p-6 hover:glow-accent transition-all duration-300">
            <Users className="w-12 h-12 text-primary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">DAO Analytics</h3>
            <p className="text-muted-foreground">
              Deep insights into DAO performance, voting patterns, and governance health.
            </p>
          </Card>
          
          <Card className="cosmic-card p-6 hover:glow-accent transition-all duration-300">
            <Zap className="w-12 h-12 text-accent mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">AI Agents</h3>
            <p className="text-muted-foreground">
              Deploy intelligent agents for automated voting and governance participation.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};