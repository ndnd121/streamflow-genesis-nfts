import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaWalletProviderProps {
  children: ReactNode;
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => {
      // Add error handling for wallet adapters to prevent extension conflicts
      const walletAdapters = [];
      
      try {
        walletAdapters.push(new PhantomWalletAdapter());
      } catch (error) {
        console.warn('PhantomWalletAdapter failed to initialize:', error);
      }
      
      try {
        walletAdapters.push(new SolflareWalletAdapter({ network }));
      } catch (error) {
        console.warn('SolflareWalletAdapter failed to initialize:', error);
      }
      
      try {
        walletAdapters.push(new TorusWalletAdapter());
      } catch (error) {
        console.warn('TorusWalletAdapter failed to initialize:', error);
      }
      
      try {
        walletAdapters.push(new LedgerWalletAdapter());
      } catch (error) {
        console.warn('LedgerWalletAdapter failed to initialize:', error);
      }
      
      return walletAdapters;
    },
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect onError={(error) => {
        console.warn('Wallet error:', error);
        // Silently handle wallet errors to prevent app crashes
      }}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};