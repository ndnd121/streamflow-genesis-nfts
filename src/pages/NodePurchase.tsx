import { NodePurchaseSection } from '@/components/NodePurchaseSection';
import { BittokLogo } from '@/components/BittokLogo';
import { Button } from '@/components/ui/button';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NodePurchase() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <BittokLogo size={32} className="drop-shadow-lg" />
              <span className="text-2xl font-brand font-bold bg-gradient-primary bg-clip-text text-transparent tracking-wide">
                BITTOK
              </span>
            </div>

            <div className="flex items-center gap-3">
              <WalletMultiButton className="!bg-gradient-primary !hover:shadow-glow-primary !text-primary-foreground !border-0 !px-6 !transition-all !duration-300 !rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      <NodePurchaseSection />
    </div>
  );
}