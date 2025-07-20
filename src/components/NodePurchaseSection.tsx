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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      {/* Header Section */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <div className="text-sm text-cyan-400 mb-4 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          Decentralized AI Video Generation Platform
        </div>
        
        <h1 className="text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            BitTok
          </span>
        </h1>
        
        <h2 className="text-4xl font-bold text-white mb-6">
          Decentralized AI Training
        </h2>
        
        <p className="text-xl text-slate-300 mb-2">
          Not your models, not your AI. Join the private AI training platform
        </p>
        <p className="text-xl text-slate-300 mb-8">
          powered by decentralized nodes.
        </p>
        
        <div className="text-cyan-400 mb-12">
          Local Data • Collaborative Training • Decentralized Network • Open Protocol
        </div>
        
        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 text-lg">
            Start Training
          </Button>
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10 px-6 py-3 text-lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            Buy Nodes
          </Button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">
            {nodesOnline.toLocaleString()}
          </div>
          <div className="text-slate-300">
            Active Nodes
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">
            50K+
          </div>
          <div className="text-slate-300">
            Videos Generated
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-4xl font-bold text-green-400 mb-2">
            99.9%
          </div>
          <div className="text-slate-300">
            Network Uptime
          </div>
        </div>
      </div>

      {/* Purchase Modal/Interface */}
      {connected && (
        <Card className="w-full max-w-md bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white text-center">Purchase Nodes</CardTitle>
            <CardDescription className="text-slate-300 text-sm text-center">
              Select quantity and complete your purchase
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Wallet Info */}
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">Wallet Connected</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Disconnect
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Link className="w-3 h-3" />
                  <span>Address: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Balance: {balance.toFixed(4)} SOL
                </div>
              </div>
            </div>

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
                <span className="text-green-400">{totalCost.toFixed(4)} SOL</span>
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
              className="w-full h-10 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:text-slate-400"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                `Purchase ${quantity} Node${quantity > 1 ? 's' : ''} - ${totalCost.toFixed(4)} SOL`
              )}
            </Button>

            {(!agreedToTerms || !agreedToPrivacy) && (
              <p className="text-xs text-slate-400 text-center">
                Please agree to Terms of Service and Privacy Policy
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Connect Wallet Section */}
      {!connected && (
        <div className="text-center space-y-4">
          <Wallet className="w-16 h-16 text-slate-400 mx-auto" />
          <p className="text-slate-400 text-lg">Connect your wallet to purchase nodes</p>
          <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !px-8 !py-3 !text-lg" />
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <Link className="w-4 h-4" />
            <span>Link your SOL wallet to purchase nodes</span>
          </div>
        </div>
      )}
    </div>
  );
};