"use client";
import React, { useMemo, useEffect, useState } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Feedback } from "./Feedback";

// Custom hook for wallet signing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useWalletSigner(setFeedback: (f: any) => void) {
  const { publicKey, signMessage, connected } = useWallet();

  useEffect(() => {
    const signAuthMessage = async () => {
      if (connected && publicKey && signMessage) {
        try {
          const message = `Authenticate wallet for Solana Stone Paper Scissors\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${new Date().toISOString()}`;
          const encodedMessage = new TextEncoder().encode(message);
          await signMessage(encodedMessage);
          setFeedback({ type: 'success', message: 'Wallet authenticated successfully!' });
          // Store authentication state
          localStorage.setItem('walletAuthenticated', 'true');
          localStorage.setItem('walletPublicKey', publicKey.toBase58());
        } catch (err: any) {
          if (err && (err.code === 4001 || err.message?.toLowerCase().includes('user rejected'))) {
            setFeedback({ type: 'warning', message: 'Wallet connection request was rejected.' });
          } else {
            setFeedback({ type: 'error', message: 'Failed to sign authentication message.' });
          }
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
      setFeedback({ type: 'info', message: 'Wallet disconnected' });
    }
  }, [connected, publicKey, signMessage, setFeedback]);

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
  const [feedback, setFeedback] = useState<null | { type: 'success' | 'error' | 'info' | 'warning'; message: string }>(null);
  useWalletSigner(setFeedback);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return <>
    {feedback && (
      <div className="fixed bottom-4 right-4 z-50 w-full max-w-xs px-2 flex flex-col items-end">
        <Feedback feedback={feedback} />
      </div>
    )}
    {children}
  </>;
} 