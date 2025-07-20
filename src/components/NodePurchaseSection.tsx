import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useNodePurchase } from '@/hooks/useNodePurchase';
import { Wallet, Coins, ShoppingCart, CheckCircle, Zap, Shield, TrendingUp, Minus, Plus, Link } from 'lucide-react';

export const NodePurchaseSection: React.FC = () => {
  const { connected, publicKey, connect, wallet, disconnect } = useWallet();
  const { config, isLoading, configLoading, purchaseNodes, checkBalance, getAvailableNodes } = useNodePurchase();
  
  const [quantity, setQuantity] = useState(1);
  const [balance, setBalance] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const availableNodes = getAvailableNodes();
  const totalCost = quantity * config.nodePriceSOL;
  const nodesOnline = config.totalNodes - availableNodes;

  // Get wallet balance
  useEffect(() => {
    if (connected && publicKey) {
      checkBalance().then(setBalance);
    }
  }, [connected, publicKey, checkBalance]);

  const handlePurchase = async () => {
    if (!agreedToTerms || !agreedToPrivacy) {
      return;
    }

    const result = await purchaseNodes(quantity);
    if (result.success) {
      // Refresh balance after successful purchase
      const newBalance = await checkBalance();
      setBalance(newBalance);
      setQuantity(1);
      setAgreedToTerms(false);
      setAgreedToPrivacy(false);
    }
  };

  const canPurchase = connected && 
                     agreedToTerms && 
                     agreedToPrivacy &&
                     quantity > 0 && 
                     quantity <= availableNodes && 
                     balance >= totalCost &&
                     !isLoading;

  // Show loading state
  if (configLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
          Purchase Compute Nodes
        </h1>
        <p className="text-muted-foreground text-sm max-w-3xl mx-auto">
          Become part of the decentralized AI network and earn token rewards and governance benefits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Node Information */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Coins className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">BitTok Compute Node</CardTitle>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Limited Offer
              </Badge>
            </div>
            <CardDescription className="text-slate-300 text-sm">
              Contribute computing power to the AI video generation network and earn stable returns
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Nodes Online</span>
                <span className="text-lg font-bold text-green-400">{nodesOnline.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Remaining Nodes</span>
                <span className="text-lg font-bold text-yellow-400">{availableNodes.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Current Price</span>
                <span className="text-lg font-bold text-green-400">{config.nodePriceSOL} SOL</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Expected APY</span>
                <span className="text-lg font-bold text-green-400">15-25%</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-white text-sm font-medium">High Performance</div>
                <div className="text-slate-400 text-xs">GPU Power</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-white text-sm font-medium">Secure & Stable</div>
                <div className="text-slate-400 text-xs">99.9% Uptime</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-white text-sm font-medium">Passive Income</div>
                <div className="text-slate-400 text-xs">Daily Rewards</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Purchase Interface */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white">Purchase Nodes</CardTitle>
            <CardDescription className="text-slate-300 text-sm">
              {!connected ? "Please connect wallet to continue purchase" : "Select quantity and complete your purchase"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!connected ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4 text-sm">Connect your wallet to get started</p>
                  <div className="space-y-3">
                    <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg" />
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                      <Link className="w-4 h-4" />
                      <span>Link your SOL wallet to purchase nodes</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Purchase Quantity */}
                <div className="space-y-3">
                  <label className="text-white font-medium text-sm">Purchase Quantity</label>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <div className="w-20 h-10 bg-slate-800 border border-slate-600 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{quantity}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(availableNodes, quantity + 1))}
                      disabled={quantity >= availableNodes}
                      className="w-10 h-10 rounded-lg border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Unit Price:</span>
                    <span>{config.nodePriceSOL} SOL</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white border-t border-slate-700 pt-2">
                    <span>Total:</span>
                    <span className="text-green-400">{totalCost.toFixed(2)} SOL</span>
                  </div>
                </div>

                {/* Balance Check */}
                {balance < totalCost && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">
                      Insufficient balance! Need {totalCost.toFixed(4)} SOL, current balance {balance.toFixed(4)} SOL
                    </p>
                  </div>
                )}

                {/* Agreements */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed">
                      I have read and agree to the{' '}
                      <span className="text-green-400 cursor-pointer hover:underline">Terms of Service</span>
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy"
                      checked={agreedToPrivacy}
                      onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="privacy" className="text-sm text-slate-300 leading-relaxed">
                      I have read and agree to the{' '}
                      <span className="text-green-400 cursor-pointer hover:underline">Privacy Policy</span>
                    </label>
                  </div>
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={handlePurchase}
                  disabled={!canPurchase}
                  className="w-full h-12 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:text-slate-400"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : !connected ? (
                    "Please Connect Wallet"
                  ) : (
                    `Purchase ${quantity} Node${quantity > 1 ? 's' : ''} - ${totalCost.toFixed(2)} SOL`
                  )}
                </Button>

                {(!agreedToTerms || !agreedToPrivacy) && connected && (
                  <p className="text-xs text-slate-400 text-center">
                    Please agree to Terms of Service and Privacy Policy
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};