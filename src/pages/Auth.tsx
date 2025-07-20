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
                  BITTOK
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
                Welcome to BITTOK
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Choose your preferred way to sign in and start creating
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email Authentication
              </div>
              <Button 
                onClick={handleGoogleSignIn}
                disabled={isConnecting || connected}
                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isConnecting ? 'Signing in...' : 'Sign in with Google'}
              </Button>
            </div>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="h-4 w-4" />
                Crypto Wallet
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