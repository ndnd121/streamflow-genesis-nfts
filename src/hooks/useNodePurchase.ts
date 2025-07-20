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

  // Load configuration from Supabase
  const loadConfig = useCallback(async () => {
    try {
      setConfigLoading(true);
      
      // If Supabase is not configured, use default configuration
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using default configuration');
        setConfig({
          recipientWallet: 'BittokNodeRecipient12345678901234567890', // Replace with real project wallet
          nodePriceSOL: 0.85,
          totalNodes: 1280,
          nodesSold: 1024,
        });
        setConfigLoading(false);
        return;
      }
      
      const { data: configData, error } = await supabase
        .from('project_config')
        .select('key, value')
        .in('key', ['recipient_wallet', 'node_price', 'total_nodes', 'nodes_sold']);

      if (error) {
        console.error('Failed to load configuration:', error);
        toast({
          title: "Configuration Load Failed",
          description: "Using default configuration",
          variant: "destructive",
        });
        return;
      }

      const configMap = Object.fromEntries(
        configData?.map(item => [item.key, item.value]) || []
      );

      setConfig({
        recipientWallet: configMap.recipient_wallet || '',
        nodePriceSOL: parseFloat(configMap.node_price) || 0.85,
        totalNodes: parseInt(configMap.total_nodes) || 1280,
        nodesSold: parseInt(configMap.nodes_sold) || 1024,
      });

    } catch (error) {
      console.error('Configuration loading error:', error);
      toast({
        title: "Configuration Load Failed",
        description: "Using default configuration",
        variant: "destructive",
      });
    } finally {
      setConfigLoading(false);
    }
  }, [toast]);

  // Update sold nodes count
  const updateNodesSold = useCallback(async (quantity: number) => {
    if (!isSupabaseConfigured()) {
      // If Supabase is not configured, only update local state
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
        console.error('Failed to update node sales:', error);
      } else {
        setConfig(prev => ({ ...prev, nodesSold: newNodesSold }));
      }
    } catch (error) {
      console.error('Error updating node sales:', error);
    }
  }, [config.nodesSold]);

  // Record purchase transaction
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
        console.error('Failed to record purchase:', error);
      }
    } catch (error) {
      console.error('Error recording purchase:', error);
    }
  }, [publicKey, config.nodePriceSOL]);

  // Purchase nodes
  const purchaseNodes = useCallback(async (
    quantity: number
  ): Promise<PurchaseResult> => {
    if (!publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return { success: false, error: 'Wallet not connected' };
    }

    if (!config.recipientWallet) {
      toast({
        title: "Configuration Error",
        description: "Recipient wallet address not configured",
        variant: "destructive",
      });
      return { success: false, error: 'Recipient wallet address not configured' };
    }

    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Purchase quantity must be greater than 0",
        variant: "destructive",
      });
      return { success: false, error: 'Invalid purchase quantity' };
    }

    if (config.nodesSold + quantity > config.totalNodes) {
      toast({
        title: "Error",
        description: "Insufficient nodes available",
        variant: "destructive",
      });
      return { success: false, error: 'Insufficient nodes available' };
    }

    setIsLoading(true);

    try {
      const totalCost = quantity * config.nodePriceSOL;
      const lamports = totalCost * LAMPORTS_PER_SOL;

      // Create transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(config.recipientWallet),
          lamports,
        })
      );

      // Get latest block hash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);

      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed');

      // Record purchase and update node count
      await Promise.all([
        recordPurchase(quantity, totalCost, signature),
        updateNodesSold(quantity)
      ]);

      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${quantity} nodes`,
      });

      return { 
        success: true, 
        transactionHash: signature 
      };

    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      let errorMessage = 'Purchase failed, please try again';
      if (error.message?.includes('insufficient')) {
        errorMessage = 'Insufficient balance';
      } else if (error.message?.includes('rejected')) {
        errorMessage = 'Transaction rejected by user';
      }

      toast({
        title: "Purchase Failed",
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

  // Check balance
  const checkBalance = useCallback(async (): Promise<number> => {
    if (!publicKey) return 0;
    
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }, [publicKey, connection]);

  // Get available nodes count
  const getAvailableNodes = useCallback((): number => {
    return config.totalNodes - config.nodesSold;
  }, [config]);

  // Load configuration when component mounts
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