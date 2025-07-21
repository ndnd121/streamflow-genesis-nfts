import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { BittokLogo } from '@/components/BittokLogo';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowLeft, Home, Wallet, Mail } from 'lucide-react';

const Auth = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const { connected, publicKey, disconnect } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Handle wallet connection success
  useEffect(() => {
    if (connected && publicKey && !user) {
      toast({
        title: "Wallet Connected",
        description: `Connected with ${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}`,
      });
      
      // For now, we'll navigate to dashboard with wallet connection
      // In the future, you could create a wallet-based auth system
      navigate('/dashboard');
    }
  }, [connected, publicKey, user, navigate, toast]);

  const handleGoogleSignIn = async () => {
    setIsConnecting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Google login failed, please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected."
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <BittokLogo size={28} className="drop-shadow-lg" />
              <span className="text-xl font-brand font-bold bg-gradient-primary bg-clip-text text-transparent tracking-wide">
                bittok
              </span>
              </div>
            </div>
            
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <BittokLogo className="h-12 w-auto" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to bittok
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Connect your wallet to sign in and start creating
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wallet Connection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="h-4 w-4" />
                Sign in with Wallet
              </div>
              
              {connected ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Wallet Connected
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate('/dashboard')}
                      className="flex-1"
                    >
                      Continue to Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleDisconnectWallet}
                      className="px-3"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="wallet-adapter-button-container">
                  <WalletMultiButton className="!w-full !h-12 !text-lg !font-medium !bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !transition-all !duration-200 !shadow-lg hover:!shadow-xl !rounded-md" />
                </div>
              )}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              By signing in, you agree to our{' '}
              <a href="#" className="underline hover:text-foreground">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;