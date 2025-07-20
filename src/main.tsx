import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Buffer } from 'buffer';
import "./index.css";

import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NodePurchase from "./pages/NodePurchase.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Toaster } from "@/components/ui/toaster";
import { SolanaWalletProvider } from "@/components/WalletProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Polyfill Buffer for Solana wallet adapters
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SolanaWalletProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/node-purchase" element={<NodePurchase />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </SolanaWalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
