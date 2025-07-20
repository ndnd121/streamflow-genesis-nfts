import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import { useToast } from "@/hooks/use-toast";

interface NodePurchaseConfig {
  recipientWallet: string;
  nodePriceSOL: number;
  totalNodes: number;
  nodesSold: number;
}

interface PurchaseResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export const useNodePurchase = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { toast } = useToast();
  
  // 配置信息 - 在实际项目中应该从API或配置文件获取
  const [config] = useState<NodePurchaseConfig>({
    recipientWallet: 'YOUR_SOLANA_WALLET_ADDRESS_HERE', // 替换为实际的收款钱包地址
    nodePriceSOL: 0.1, // 每个节点的价格（SOL）
    totalNodes: 1000,
    nodesSold: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const purchaseNodes = useCallback(async (
    quantity: number
  ): Promise<PurchaseResult> => {
    if (!publicKey) {
      toast({
        title: "错误",
        description: "请先连接钱包",
        variant: "destructive",
      });
      return { success: false, error: '钱包未连接' };
    }

    if (!config.recipientWallet || config.recipientWallet === 'YOUR_SOLANA_WALLET_ADDRESS_HERE') {
      toast({
        title: "配置错误",
        description: "收款钱包地址未配置",
        variant: "destructive",
      });
      return { success: false, error: '收款钱包地址未配置' };
    }

    if (quantity <= 0) {
      toast({
        title: "错误",
        description: "购买数量必须大于0",
        variant: "destructive",
      });
      return { success: false, error: '无效的购买数量' };
    }

    if (config.nodesSold + quantity > config.totalNodes) {
      toast({
        title: "错误",
        description: "剩余节点数量不足",
        variant: "destructive",
      });
      return { success: false, error: '节点数量不足' };
    }

    setIsLoading(true);

    try {
      const totalCost = quantity * config.nodePriceSOL;
      const lamports = totalCost * LAMPORTS_PER_SOL;

      // 创建转账交易
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(config.recipientWallet),
          lamports,
        })
      );

      // 获取最新的区块哈希
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // 发送交易
      const signature = await sendTransaction(transaction, connection);

      // 确认交易
      await connection.confirmTransaction(signature, 'confirmed');

      toast({
        title: "购买成功",
        description: `成功购买 ${quantity} 个节点`,
      });

      // 这里可以添加数据库记录逻辑
      // await recordPurchase(quantity, totalCost, signature);

      return { 
        success: true, 
        transactionHash: signature 
      };

    } catch (error: any) {
      console.error('购买失败:', error);
      
      let errorMessage = '购买失败，请重试';
      if (error.message?.includes('insufficient')) {
        errorMessage = '余额不足';
      } else if (error.message?.includes('rejected')) {
        errorMessage = '交易被用户拒绝';
      }

      toast({
        title: "购买失败",
        description: errorMessage,
        variant: "destructive",
      });

      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, sendTransaction, connection, config, toast]);

  // 检查余额
  const checkBalance = useCallback(async (): Promise<number> => {
    if (!publicKey) return 0;
    
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('获取余额失败:', error);
      return 0;
    }
  }, [publicKey, connection]);

  // 获取可用节点数量
  const getAvailableNodes = useCallback((): number => {
    return config.totalNodes - config.nodesSold;
  }, [config]);

  return {
    config,
    isLoading,
    purchaseNodes,
    checkBalance,
    getAvailableNodes,
  };
};