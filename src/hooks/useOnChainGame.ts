import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import { getProgramFromWallet } from "../lib/anchorConnection";

interface GameState {
  player1: PublicKey;
  player2: PublicKey | null;
  join_code: number[];
  status: {
    waiting?: boolean;
    inProgress?: boolean;
    completed?: boolean;
    winningsClaimed?: boolean;
  };
  bet_amount: BN;
  rounds_won_p1: number;
  rounds_won_p2: number;
  total_rounds: number;
  created_at: BN;
  last_activity: BN;
  game_bump: number;
  player1_refunded: boolean;
  player2_refunded: boolean;
  player1_timeout_refunded: boolean;
  player2_timeout_refunded: boolean;
  player1_commit: number[] | null;
  player2_commit: number[] | null;
  player1_move: { rock?: boolean; paper?: boolean; scissors?: boolean } | null;
  player2_move: { rock?: boolean; paper?: boolean; scissors?: boolean } | null;
}

interface UseOnChainGameReturn {
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
  commitMove: (commit: Uint8Array) => Promise<void>;
  revealMove: (playerMove: number, salt: BN) => Promise<void>;
  stopPolling: () => void;
}

function useOnChainGame(joinCode: string): UseOnChainGameReturn {
  const { publicKey, wallet, signTransaction } = useWallet();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gamePda, setGamePda] = useState<PublicKey | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  // Derive game PDA using joinCode
  useEffect(() => {
    if (!joinCode || !wallet || !publicKey) return;
    setLoading(true); // Set loading immediately when joinCode changes
    const initProgram = async () => {
      try {
        const program = await getProgramFromWallet(wallet);
        const joinCodeBytes = new TextEncoder().encode(joinCode.padEnd(8, "\0")).slice(0, 8);
        const [pda] = await PublicKey.findProgramAddress(
          [Buffer.from("game"), joinCodeBytes],
          program.programId
        );
        setGamePda(pda);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to initialize program");
      }
    };
    initProgram();
  }, [joinCode, wallet, publicKey]);

  const fetchGame = useCallback(async () => {
    if (!gamePda || !wallet || !publicKey) {
      return;
    }
    
    // Debounce: prevent fetching more than once every 2 seconds
    const now = Date.now();
    if (now - lastFetchTime < 2000) {
      return;
    }
    setLastFetchTime(now);
    
    setLoading(true);
    setError(null);
    
    try {
      const program = await getProgramFromWallet(wallet);
      
      const account = await program.account.game.fetch(gamePda);
      
      // Check for undefined values and provide fallbacks
      const processedAccount = {
        ...account,
        total_rounds: account.totalRounds || 0,
        rounds_won_p1: account.roundsWonP1 || 0,
        rounds_won_p2: account.roundsWonP2 || 0,
        player1_commit: account.player1Commit || null,
        player2_commit: account.player2Commit || null,
        player1_move: account.player1Move || null,
        player2_move: account.player2Move || null,
      };
      
      // Process the status properly
      let processedStatus = {};
      if (account.status) {
        if (account.status.waiting !== undefined) {
          processedStatus = { waiting: true };
        } else if (account.status.inProgress !== undefined) {
          processedStatus = { inProgress: true };
        } else if (account.status.completed !== undefined) {
          processedStatus = { completed: true };
        } else if (account.status.winningsClaimed !== undefined) {
          processedStatus = { winningsClaimed: true };
        }
      }
      
      const finalProcessedAccount = {
        ...processedAccount,
        status: processedStatus
      };
      
      // Wallet pubkey verification
      if (
        publicKey &&
        account.player1 &&
        account.player1.toBase58 &&
        publicKey.toBase58() !== account.player1.toBase58() &&
        (!account.player2 || (account.player2.toBase58 && publicKey.toBase58() !== account.player2.toBase58()))
      ) {
        setError('Connected wallet is not a participant in this game.');
        setGameState(null);
        return;
      }
      
      setGameState(finalProcessedAccount as unknown as GameState);
    } catch (e: unknown) {
      // Handle missing accounts gracefully - this happens when games are completed and closed
      const errorMessage = e instanceof Error ? e.message : String(e);
      if (errorMessage.includes('Account does not exist') || 
          errorMessage.includes('Account does not exist or has no data') ||
          errorMessage.includes('AccountNotInitialized') ||
          errorMessage.includes('0xbc4') ||
          errorMessage.includes('3012') ||
          errorMessage.includes('5AUYsm51SNxEp7b2c9ey5L1xRTgatmGc1GoY2pLDEGst')) {
        // Clear game state since account is closed
        setGameState(null);
        setError(null);
        // Stop polling by clearing the gamePda
        setGamePda(null);
        return; // Exit early to prevent further polling
      } else {
        setError(e instanceof Error ? e.message : "Failed to fetch game state");
      }
    } finally {
      setLoading(false);
    }
  }, [gamePda, wallet, publicKey, lastFetchTime]);

  // Exponential backoff polling
  useEffect(() => {
    if (!gamePda) {
      return;
    }
    let intervalMs = 2000;
    let stopped = false;
    const poll = async () => {
      while (!stopped) {
        await fetchGame();
        await new Promise(res => setTimeout(res, intervalMs));
        if (intervalMs < 10000) intervalMs *= 1.5; // Exponential backoff up to 10s
      }
    };
    poll();
    return () => { stopped = true; };
  }, [gamePda, fetchGame]);

  const commitMove = async (commit: Uint8Array) => {
    if (!wallet || !gamePda || !publicKey || !signTransaction) return;
    
    // Validate commit length
    if (commit.length !== 32) {
      setError("Commit must be exactly 32 bytes");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const program = await getProgramFromWallet(wallet);
      
      // Convert Uint8Array to number array for IDL compatibility
      const commitArray = Array.from(commit);
      
      const tx = await program.methods.commitMove(commitArray).accounts({
        game: gamePda,
        player: publicKey,
        systemProgram: SystemProgram.programId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any).transaction();

      // Sign and send transaction manually
      const connection = program.provider.connection;
      const latestBlockhash = await connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = publicKey;
      
      const signedTx = await signTransaction(tx);
      const txId = await connection.sendRawTransaction(signedTx.serialize());
      
      // Confirm using polling
      let retries = 0;
      const maxRetries = 30;
      while (retries < maxRetries) {
        try {
          const status = await connection.getSignatureStatus(txId);
          if (status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized') {
            break;
          }
          if (status.value?.err) {
            throw new Error(`Transaction failed: ${JSON.stringify(status.value.err)}`);
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.message.includes('Transaction failed')) {
            throw error;
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
      }
      
      await fetchGame();
      
    } catch (e: unknown) {
      // Handle specific game errors with user-friendly messages
      let errorMessage = "Failed to commit move. ";
      
      // Check for InvalidGameStatus error (0x1774 = 6004)
      if (e instanceof Error && (e.message?.includes('InvalidGameStatus') || 
          e.message?.includes('0x1774') || 
          e.message?.includes('6004') ||
          e.message?.includes('Invalid game state'))) {
        errorMessage = "Game is not ready for moves yet. Please wait for both players to join.";
      } else if (e instanceof Error && (e.message?.includes('AlreadyCommitted') || 
          e.message?.includes('0x177f') || 
          e.message?.includes('6015') ||
          e.message?.includes('Player has already committed a move this round'))) {
        errorMessage = "You have already committed a move this round. Please wait for the other player.";
      } else if (e instanceof Error && e.message?.includes('Unauthorized')) {
        errorMessage = "You are not authorized to commit a move in this game.";
      } else if (e instanceof Error && e.message?.includes('Game timed out')) {
        errorMessage = "Game has timed out.";
      } else if (e instanceof Error && e.message?.includes('Invalid commit')) {
        errorMessage = "Invalid commit hash provided.";
      } else {
        errorMessage += e instanceof Error ? e.message : "Unknown error occurred.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const revealMove = async (playerMove: number, salt: BN) => {
    if (!wallet || !gamePda || !publicKey || !signTransaction) return;
    
    // Prevent multiple simultaneous reveal attempts
    if (isRevealing) {
      return;
    }
    
    setIsRevealing(true);
    setLoading(true);
    setError(null);
    
    try {
      const program = await getProgramFromWallet(wallet);
      
      // Validate move
      if (![0, 1, 2].includes(playerMove)) {
        throw new Error("Invalid move. Must be 0 (rock), 1 (paper), or 2 (scissors)");
      }
      
      // Create move object matching IDL enum format
      const moveObject = playerMove === 0 ? { rock: {} } : 
                        playerMove === 1 ? { paper: {} } : 
                        { scissors: {} };
      
      const tx = await program.methods.revealMove(moveObject, salt).accounts({
        game: gamePda,
        player: publicKey,
        systemProgram: SystemProgram.programId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any).transaction();

      // Sign and send transaction manually
      const connection = program.provider.connection;
      const latestBlockhash = await connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = publicKey;
      
      const signedTx = await signTransaction(tx);
      const txId = await connection.sendRawTransaction(signedTx.serialize());
      
      // Confirm using polling
      let retries = 0;
      const maxRetries = 30;
      while (retries < maxRetries) {
        try {
          const status = await connection.getSignatureStatus(txId);
          if (status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized') {
            break;
          }
          if (status.value?.err) {
            throw new Error(`Transaction failed: ${JSON.stringify(status.value.err)}`);
          }
        } catch (error: unknown) {
          if (error instanceof Error && error.message.includes('Transaction failed')) {
            throw error;
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
      }
      
      await fetchGame();
    } catch (e: unknown) {
      let errorMessage = "Failed to reveal move. ";
      
      if (e instanceof Error && e.message?.includes('Invalid move')) {
        errorMessage = "Invalid move provided.";
      } else if (e instanceof Error && e.message?.includes('Invalid salt')) {
        errorMessage = "Invalid salt provided.";
      } else if (e instanceof Error && e.message?.includes('Unauthorized')) {
        errorMessage = "You are not authorized to reveal a move in this game.";
      } else if (e instanceof Error && e.message?.includes('Game not in progress')) {
        errorMessage = "Game is not in progress.";
      } else {
        errorMessage += e instanceof Error ? e.message : "Unknown error occurred.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsRevealing(false);
    }
  };

  const stopPolling = () => {
    setGamePda(null);
  };

  return {
    gameState,
    loading,
    error,
    commitMove,
    revealMove,
    stopPolling,
  };
}

export { useOnChainGame };