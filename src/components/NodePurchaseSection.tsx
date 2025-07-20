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

  // 获取钱包余额
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
      // 购买成功后重新获取余额
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

  // 显示加载状态
  if (configLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">加载配置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* 头部信息 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          节点购买平台
        </h1>
        <p className="text-muted-foreground text-lg">
          购买网络节点，参与去中心化生态系统
        </p>
      </div>

      {/* 节点信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            节点信息
          </CardTitle>
          <CardDescription>
            当前节点销售情况和价格信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{config.nodePriceSOL} SOL</div>
              <div className="text-sm text-muted-foreground">单价</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{availableNodes}</div>
              <div className="text-sm text-muted-foreground">可购买节点</div>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(config.nodesSold / config.totalNodes) * 100}%` }}
            />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            已售出 {config.nodesSold} / {config.totalNodes} 个节点
          </div>
        </CardContent>
      </Card>

      {/* 配置提醒 */}
      {!configLoading && config.recipientWallet === 'YOUR_SOLANA_WALLET_ADDRESS_HERE' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2">
                <Coins className="h-4 w-4 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">
                  需要配置收款钱包地址
                </p>
                <p className="text-xs text-amber-700">
                  请在 useNodePurchase.ts 中将 'YOUR_SOLANA_WALLET_ADDRESS_HERE' 替换为您的实际 Solana 钱包地址
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 钱包连接 */}
      {!connected ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              连接钱包
            </CardTitle>
            <CardDescription>
              请连接您的 Solana 钱包以继续购买
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
          {/* 钱包信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                钱包已连接
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">钱包地址:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">余额:</span>
                <span className="font-semibold">{balance.toFixed(4)} SOL</span>
              </div>
            </CardContent>
          </Card>

          {/* 购买界面 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                购买节点
              </CardTitle>
              <CardDescription>
                选择购买数量并完成支付
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 数量选择 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">购买数量</label>
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
                  最多可购买 {availableNodes} 个节点
                </div>
              </div>

              {/* 费用计算 */}
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between">
                  <span>单价:</span>
                  <span>{config.nodePriceSOL} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>数量:</span>
                  <span>{quantity}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>总计:</span>
                    <span className="text-primary">{totalCost.toFixed(4)} SOL</span>
                  </div>
                </div>
              </div>

              {/* 余额检查 */}
              {balance < totalCost && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">
                    余额不足！需要 {totalCost.toFixed(4)} SOL，当前余额 {balance.toFixed(4)} SOL
                  </p>
                </div>
              )}

              {/* 服务条款 */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  我已阅读并同意服务条款和隐私政策。我了解这是一个去中心化交易，交易一旦确认将无法撤销。
                </label>
              </div>

              {/* 购买按钮 */}
              <Button
                onClick={handlePurchase}
                disabled={!canPurchase}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    处理中...
                  </>
                ) : (
                  `购买 ${quantity} 个节点 (${totalCost.toFixed(4)} SOL)`
                )}
              </Button>

              {!agreedToTerms && (
                <p className="text-xs text-muted-foreground text-center">
                  请先同意服务条款
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* 免责声明 */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ 风险提示：加密货币交易存在风险，请确保您完全理解相关风险后再进行投资。
            本平台不对任何损失承担责任。
          </p>
        </CardContent>
      </Card>
    </div>
  );
};