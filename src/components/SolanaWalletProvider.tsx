"use client";
import React, { useMemo, useEffect } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import "@solana/wallet-adapter-react-ui/styles.css";

// Custom hook for wallet signing
function useWalletSigner() {
  const { publicKey, signMessage, connected } = useWallet();

  useEffect(() => {
    const signAuthMessage = async () => {
      if (connected && publicKey && signMessage) {
        try {
          const message = `Authenticate wallet for Solana Stone Paper Scissors\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${new Date().toISOString()}`;
          const encodedMessage = new TextEncoder().encode(message);
          
          const signature = await signMessage(encodedMessage);
          console.log("Wallet authenticated successfully:", {
            publicKey: publicKey.toBase58(),
            signature: Buffer.from(signature).toString('base64')
          });
          
          // Store authentication state
          localStorage.setItem('walletAuthenticated', 'true');
          localStorage.setItem('walletPublicKey', publicKey.toBase58());
          
        } catch (error) {
          console.error("Failed to sign authentication message:", error);
          localStorage.removeItem('walletAuthenticated');
        }
      }
    };

    if (connected) {
      signAuthMessage();
    } else {
      // Clear authentication when disconnected
      localStorage.removeItem('walletAuthenticated');
      localStorage.removeItem('walletPublicKey');
    }
  }, [connected, publicKey, signMessage]);

  return { publicKey, connected };
}

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://rpc.gorbagana.wtf";

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider key="solana-wallet-modal">
          <WalletSignerWrapper>
            {children}
          </WalletSignerWrapper>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Wrapper component to handle wallet signing
function WalletSignerWrapper({ children }: { children: React.ReactNode }) {
  useWalletSigner();
  return <>{children}</>;
} 