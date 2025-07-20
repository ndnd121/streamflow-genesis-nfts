import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useNodePurchase } from '@/hooks/useNodePurchase';
import { Wallet, Coins, ShoppingCart, CheckCircle } from 'lucide-react';

export const NodePurchaseSection: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { config, isLoading, configLoading, purchaseNodes, checkBalance, getAvailableNodes } = useNodePurchase();
  
  const [quantity, setQuantity] = useState(1);
  const [balance, setBalance] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const availableNodes = getAvailableNodes();
  const totalCost = quantity * config.nodePriceSOL;

  // Get wallet balance
  useEffect(() => {
    if (connected && publicKey) {
      checkBalance().then(setBalance);
    }
  }, [connected, publicKey, checkBalance]);

  const handlePurchase = async () => {
    if (!agreedToTerms) {
      return;
    }

    const result = await purchaseNodes(quantity);
    if (result.success) {
      // Refresh balance after successful purchase
      const newBalance = await checkBalance();
      setBalance(newBalance);
      setQuantity(1);
      setAgreedToTerms(false);
    }
  };

  const canPurchase = connected && 
                     agreedToTerms && 
                     quantity > 0 && 
                     quantity <= availableNodes && 
                     balance >= totalCost &&
                     !isLoading;

  // Show loading state
  if (configLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header Information */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Node Purchase Platform
        </h1>
        <p className="text-muted-foreground text-lg">
          Purchase network nodes and participate in the decentralized ecosystem
        </p>
      </div>

      {/* Node Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Node Information
          </CardTitle>
          <CardDescription>
            Current node sales status and pricing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{config.nodePriceSOL} SOL</div>
              <div className="text-sm text-muted-foreground">Unit Price</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{availableNodes}</div>
              <div className="text-sm text-muted-foreground">Available Nodes</div>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(config.nodesSold / config.totalNodes) * 100}%` }}
            />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Sold {config.nodesSold} / {config.totalNodes} nodes
          </div>
        </CardContent>
      </Card>

      {/* Configuration Reminder */}
      {!configLoading && config.recipientWallet === 'YOUR_SOLANA_WALLET_ADDRESS_HERE' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2">
                <Coins className="h-4 w-4 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">
                  Recipient wallet address needs configuration
                </p>
                <p className="text-xs text-amber-700">
                  Please replace 'YOUR_SOLANA_WALLET_ADDRESS_HERE' with your actual Solana wallet address in useNodePurchase.ts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Connection */}
      {!connected ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connect Wallet
            </CardTitle>
            <CardDescription>
              Please connect your Solana wallet to continue purchasing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Wallet Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Wallet Connected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wallet Address:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-semibold">{balance.toFixed(4)} SOL</span>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase Nodes
              </CardTitle>
              <CardDescription>
                Select quantity and complete payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quantity Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Quantity</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="flex-1 text-center font-medium text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(availableNodes, quantity + 1))}
                    disabled={quantity >= availableNodes}
                  >
                    +
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Maximum {availableNodes} nodes available for purchase
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span>{config.nodePriceSOL} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{totalCost.toFixed(4)} SOL</span>
                  </div>
                </div>
              </div>

              {/* Balance Check */}
              {balance < totalCost && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">
                    Insufficient balance! Need {totalCost.toFixed(4)} SOL, current balance {balance.toFixed(4)} SOL
                  </p>
                </div>
              )}

              {/* Terms of Service */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  I have read and agree to the Terms of Service and Privacy Policy. I understand this is a decentralized transaction and cannot be reversed once confirmed.
                </label>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={!canPurchase}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  `Purchase ${quantity} nodes (${totalCost.toFixed(4)} SOL)`
                )}
              </Button>

              {!agreedToTerms && (
                <p className="text-xs text-muted-foreground text-center">
                  Please agree to the Terms of Service first
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Disclaimer */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ Risk Notice: Cryptocurrency trading involves risks. Please ensure you fully understand the risks before investing.
            This platform is not responsible for any losses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};