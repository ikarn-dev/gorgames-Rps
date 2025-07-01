"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SolanaWalletProvider } from "../../components/SolanaWalletProvider";

// Dynamically import wallet components to prevent hydration issues

const GameArena = dynamic(
  () => import("../../components/GameArena"),
  { ssr: false }
);

export default function Lobby() {
  return (
    <SolanaWalletProvider>
      <Suspense fallback={<div>Loading game...</div>}>
        <GameArena />
      </Suspense>
    </SolanaWalletProvider>
  );
}
