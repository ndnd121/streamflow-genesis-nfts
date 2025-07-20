import { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

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
  
  const [config, setConfig] = useState<NodePurchaseConfig>({
    recipientWallet: '',
    nodePriceSOL: 0.1,
    totalNodes: 1000,
    nodesSold: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);

  // 从 Supabase 加载配置
  const loadConfig = useCallback(async () => {
    try {
      setConfigLoading(true);
      
      // 如果 Supabase 未配置，使用默认配置
      if (!isSupabaseConfigured()) {
        console.log('Supabase 未配置，使用默认配置');
        setConfig({
          recipientWallet: 'YOUR_SOLANA_WALLET_ADDRESS_HERE', // 需要替换为实际地址
          nodePriceSOL: 0.1,
          totalNodes: 1000,
          nodesSold: 0,
        });
        setConfigLoading(false);
        return;
      }
      
      const { data: configData, error } = await supabase
        .from('project_config')
        .select('key, value')
        .in('key', ['recipient_wallet', 'node_price', 'total_nodes', 'nodes_sold']);

      if (error) {
        console.error('加载配置失败:', error);
        toast({
          title: "配置加载失败",
          description: "使用默认配置",
          variant: "destructive",
        });
        return;
      }

      const configMap = Object.fromEntries(
        configData?.map(item => [item.key, item.value]) || []
      );

      setConfig({
        recipientWallet: configMap.recipient_wallet || '',
        nodePriceSOL: parseFloat(configMap.node_price) || 0.1,
        totalNodes: parseInt(configMap.total_nodes) || 1000,
        nodesSold: parseInt(configMap.nodes_sold) || 0,
      });

    } catch (error) {
      console.error('加载配置异常:', error);
      toast({
        title: "配置加载失败",
        description: "使用默认配置",
        variant: "destructive",
      });
    } finally {
      setConfigLoading(false);
    }
  }, [toast]);

  // 更新已售节点数
  const updateNodesSold = useCallback(async (quantity: number) => {
    if (!isSupabaseConfigured()) {
      // 如果 Supabase 未配置，只更新本地状态
      setConfig(prev => ({ ...prev, nodesSold: prev.nodesSold + quantity }));
      return;
    }

    try {
      const newNodesSold = config.nodesSold + quantity;
      
      const { error } = await supabase
        .from('project_config')
        .update({ value: newNodesSold.toString() })
        .eq('key', 'nodes_sold');

      if (error) {
        console.error('更新节点销量失败:', error);
      } else {
        setConfig(prev => ({ ...prev, nodesSold: newNodesSold }));
      }
    } catch (error) {
      console.error('更新节点销量异常:', error);
    }
  }, [config.nodesSold]);

  // 记录购买交易
  const recordPurchase = useCallback(async (
    quantity: number, 
    totalPrice: number, 
    transactionHash: string
  ) => {
    if (!publicKey || !isSupabaseConfigured()) return;

    try {
      const { error } = await supabase
        .from('node_purchases')
        .insert({
          user_wallet: publicKey.toString(),
          quantity,
          unit_price: config.nodePriceSOL,
          total_price: totalPrice,
          transaction_hash: transactionHash,
          status: 'completed'
        });

      if (error) {
        console.error('记录购买失败:', error);
      }
    } catch (error) {
      console.error('记录购买异常:', error);
    }
  }, [publicKey, config.nodePriceSOL]);

  // 购买节点
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

    if (!config.recipientWallet) {
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

      // 记录购买和更新节点数
      await Promise.all([
        recordPurchase(quantity, totalCost, signature),
        updateNodesSold(quantity)
      ]);

      toast({
        title: "购买成功",
        description: `成功购买 ${quantity} 个节点`,
      });

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
  }, [publicKey, sendTransaction, connection, config, toast, recordPurchase, updateNodesSold]);

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

  // 组件挂载时加载配置
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    isLoading,
    configLoading,
    purchaseNodes,
    checkBalance,
    getAvailableNodes,
    loadConfig,
  };
};