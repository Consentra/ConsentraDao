import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vote, MessageSquare, BarChart3, Users, Sparkles, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useSoulboundIdentityNFT } from '@/hooks/useContracts';
import { useAccount } from 'wagmi';

export const Header = () => {
  const { address } = useAccount();
  const { isVerified } = useSoulboundIdentityNFT();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 cosmic-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg glow">
              <img 
                src="/lovable-uploads/ed61f1b8-7771-4919-aea0-0e72668a9a89.png" 
                alt="Consentra Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold gradient-text">Consentra</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/daos">
              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                <Users className="w-4 h-4 mr-2" />
                DAOs
              </Button>
            </Link>
            <Link to="/voting">
              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                <Vote className="w-4 h-4 mr-2" />
                Voting
              </Button>
            </Link>
            <Link to="/ai-chat">
              <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {address && (
            <Badge variant={isVerified ? "default" : "outline"} className="flex items-center gap-1">
              {isVerified ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  Not Verified
                </>
              )}
            </Badge>
          )}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};