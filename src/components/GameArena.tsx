import React, { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import BN from 'bn.js';
import CryptoJS from 'crypto-js';
import { getProgramFromWallet } from '../lib/anchorConnection';
import { useOnChainGame } from '../hooks/useOnChainGame';
import { GameControlButtons } from './GameControlButtons';
import { GameCompletion } from './GameCompletion';
import GameSummary from './GameSummary';
import PlayerInfo from './PlayerInfo';
import GameStatus from './GameStatus';
import TurnIndicator from './TurnIndicator';
import RoundProgress from './RoundProgress';
import CommitMove from './CommitMove';
import { Feedback } from './Feedback';

// Add Phantom wallet type to window object
declare global {
    interface Window {
        solana?: {
            disconnect(): Promise<void>;
        }
    }
}

// Main component
const GameArena: React.FC = () => {
    const { connection } = useConnection();
    const { connected, publicKey, disconnect, signTransaction } = useWallet();
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const [joinCode, setJoinCode] = useState('');
    const [betAmount, setBetAmount] = useState('0.05');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [gameJoinCode, setGameJoinCode] = useState<string>('');
    const [committedSalt, setCommittedSalt] = useState<BN | null>(null);
    const [committedMove, setCommittedMove] = useState<number | null>(null);
    const [isAutoRevealing, setIsAutoRevealing] = useState(false);
    const [hasRevealed, setHasRevealed] = useState<string | null>(null);
    const [showNextRoundCountdown, setShowNextRoundCountdown] = useState(false);
    const [joinFeedbackShown, setJoinFeedbackShown] = useState(false);
    const [roundResults, setRoundResults] = useState<Array<{round: number, player1Move: string, player2Move: string, winner: string}>>([]);
    const [shownFeedbackMessages, setShownFeedbackMessages] = useState<Set<string>>(new Set());
    const [lastRoundResult, setLastRoundResult] = useState<{
        round: number;
        player1Move: string;
        player2Move: string;
        winner: string;
        p1Score: number;
        p2Score: number;
    } | null>(null);
    const [copyStatus, setCopyStatus] = useState<string>('Copy');
    const [shownRounds, setShownRounds] = useState<Set<number>>(new Set());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning' | 'info', message: string } | null>(null);
    const [roomReady, setRoomReady] = useState(false);
    const [missingGameSince, setMissingGameSince] = useState<number | null>(null);

    const { gameState, loading: gameLoading, commitMove, revealMove, stopPolling } = useOnChainGame(gameJoinCode);
    
    // Check connection status
    useEffect(() => {
        const checkConnection = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const slot = await connection.getSlot();
            } catch (error) {
                console.error('Connection error:', error);
            }
        };

        if (connection) {
            checkConnection();
        }
    }, [connection]);

    const clearFeedback = useCallback(() => {
        setTimeout(() => setFeedback(null), 5000);
    }, []);

    const setFeedbackOnce = useCallback((feedbackData: { type: 'success' | 'error' | 'warning' | 'info', message: string }) => {
        const messageKey = `${feedbackData.type}:${feedbackData.message}`;
        if (!shownFeedbackMessages.has(messageKey)) {
            setShownFeedbackMessages(prev => new Set([...prev, messageKey]));
            setFeedback(feedbackData);
            setTimeout(() => {
                setFeedback(null);
                setShownFeedbackMessages(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(messageKey);
                    return newSet;
                });
            }, 2000); // Auto-disappear after 2 seconds
        }
    }, [shownFeedbackMessages]);

    const handleInitializeGame = useCallback(async () => {
        if (!publicKey || !connected || !signTransaction) {
            setFeedbackOnce({ type: 'error', message: 'Please connect your wallet first.' });
            return;
        }

        // Auto-generate join code if empty
        let code = joinCode.trim();
        if (!code) {
            // Generate a random 8-char code
            code = Math.random().toString(36).substring(2, 10).toUpperCase();
            setJoinCode(code);
        }

        if (code.length > 8) {
            setFeedbackOnce({ type: 'error', message: 'Join code must be 8 characters or less.' });
            return;
        }

        setIsCreating(true);
        setFeedbackOnce({ type: 'info', message: 'Initializing game...' });

        try {
            // Check if we have enough SOL for the transaction
            const balance = await connection.getBalance(publicKey);
            const betAmountLamports = Math.floor(parseFloat(betAmount) * 1e9); // Convert SOL to lamports
            if (balance < betAmountLamports + 1000000) { // bet amount + 0.001 SOL for fees
                throw new Error('Insufficient SOL balance for bet and transaction fees.');
            }

            // FIX: Pass the wallet directly instead of creating a custom object
            const program = await getProgramFromWallet({
                publicKey,
                disconnect,
                signTransaction,
            });
            
            // Convert join code to bytes and then to number array
            const joinCodeBytes = Array.from(new TextEncoder().encode(code.padEnd(8, '\0')).slice(0, 8));
            
            // FIX: Derive the game PDA explicitly
            const [gamePda] = await PublicKey.findProgramAddress(
                [Buffer.from("game"), Buffer.from(joinCodeBytes)],
                program.programId
            );

            console.log("Creating transaction with:", {
                joinCodeBytes,
                betAmountLamports,
                gamePda: gamePda.toBase58(),
                player1: publicKey.toBase58(),
                programId: program.programId.toBase58()
            });

            const tx = await program.methods
                .initializeGame(joinCodeBytes, new BN(betAmountLamports))
                .accounts({
                    game: gamePda,
                    player1: publicKey,
                    systemProgram: SystemProgram.programId,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any)
                .transaction();

            // Sign and send transaction manually
            const latestBlockhash = await connection.getLatestBlockhash();
            if (!signTransaction) {
                throw new Error('Wallet does not support transaction signing');
            }
            tx.recentBlockhash = latestBlockhash.blockhash;
            tx.feePayer = publicKey;
            
            const signedTx = await signTransaction(tx);
            const txId = await connection.sendRawTransaction(signedTx.serialize());
            
            // Confirm using polling instead of WebSocket
            let confirmation = null;
            let retries = 0;
            const maxRetries = 30; // 30 seconds timeout
            
            while (retries < maxRetries) {
                try {
                    const status = await connection.getSignatureStatus(txId);
                    if (status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized') {
                        confirmation = status;
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
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                retries++;
            }
            
            if (!confirmation) {
                throw new Error('Transaction confirmation timeout');
            }

            console.log("Transaction successful:", txId);

            setFeedbackOnce({ 
                type: 'success', 
                message: `Game "${code}" initialized successfully! Transaction: ${txId.slice(0, 8)}...` 
            });

            // --- POLL FOR ROOM READINESS ---
            setRoomReady(false);
            const confirmationTime = Date.now();
            let pollTries = 0;
            const maxPollTries = 60; // poll for up to 60 seconds
            let foundRoom = false;
            while (pollTries < maxPollTries) {
                try {
                    const program = await getProgramFromWallet({ publicKey, disconnect, signTransaction });
                    const joinCodeBytes = Array.from(new TextEncoder().encode(code.padEnd(8, '\0')).slice(0, 8));
                    const [gamePda] = await PublicKey.findProgramAddress(
                        [Buffer.from("game"), Buffer.from(joinCodeBytes)],
                        program.programId
                    );
                    const gameAccount = await program.account.game.fetch(gamePda);
                    if (gameAccount && gameAccount.status && gameAccount.status.waiting !== undefined) {
                        setRoomReady(true);
                        foundRoom = true;
                        break;
                    }
                } catch (e) {
                    // Ignore fetch errors, just keep polling
                }
                await new Promise(res => setTimeout(res, 1000));
                pollTries++;
                // Only warn if 30 seconds have passed since confirmation
                if (!foundRoom && Date.now() - confirmationTime > 30000 && pollTries % 5 === 0) {
                    setFeedbackOnce({ type: 'warning', message: 'Room may not be ready yet. Please wait a moment before joining.' });
                }
            }
            if (foundRoom) {
                setGameJoinCode(code);
                setJoinCode('');
                setRoomReady(true);
                setFeedbackOnce({ type: 'success', message: `Game "${code}" created and ready!` });
            } else {
                setFeedbackOnce({ type: 'error', message: 'Room was not found after 60 seconds. Please try again.' });
            }
            // --- END POLL ---

        } catch (error: unknown) {
            console.error("Failed to initialize game:", error);
            console.error("Error details:", {
                message: error instanceof Error ? error.message : 'Unknown error',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                logs: Array.isArray((error as any)?.logs) ? (error as any).logs : [],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                error: (error as any)?.error,
                stack: error instanceof Error ? error.stack : undefined
            });
            
            let errorMessage = 'Failed to initialize game. ';
            
            if (error instanceof Error) {
                if (error.message?.includes('insufficient funds')) {
                    errorMessage += 'Insufficient SOL for bet and transaction fees.';
                } else if (error.message?.includes('blockhash not found')) {
                    errorMessage += 'Network congestion. Please try again.';
                } else if (error.message?.includes('Transaction simulation failed')) {
                    errorMessage += 'Smart contract execution failed. Check contract deployment.';
                } else if (error.message?.includes('already exists')) {
                    errorMessage += 'Game with this join code already exists.';
                } else if (error.message?.includes('size')) {
                    errorMessage += 'Wallet connection issue. Please reconnect your wallet.';
                } else if ((error as unknown as { logs?: string[] })?.logs) {
                    errorMessage += `Contract error: ${(error as unknown as { logs: string[] }).logs.join(', ')}`;
                } else if (error.message) {
                    errorMessage += error.message;
                } else {
                    errorMessage += JSON.stringify(error);
                }
            } else {
                errorMessage += JSON.stringify(error);
            }
            
            setFeedbackOnce({ type: 'error', message: errorMessage });
        } finally {
            setIsCreating(false);
        }
    }, [publicKey, connected, signTransaction, joinCode, betAmount, connection, clearFeedback, setFeedbackOnce]);

    const handleJoinGame = useCallback(async () => {
        if (!publicKey || !connected || !disconnect) {
            setFeedbackOnce({ type: 'error', message: 'Please connect your wallet first.' });
            return;
        }

        const code = joinCode.trim();
        if (!code) {
            setFeedbackOnce({ type: 'error', message: 'Please enter a join code.' });
            return;
        }

        if (code.length > 8) {
            setFeedbackOnce({ type: 'error', message: 'Join code must be 8 characters or less.' });
            return;
        }

        // Check if player is trying to join their own game
        if (gameJoinCode === code) {
            setFeedbackOnce({ type: 'error', message: 'You cannot join your own game. Please use a different join code.' });
            return;
        }

        setIsJoining(true);
        setFeedbackOnce({ type: 'info', message: 'Joining game...' });

        try {
            console.log("Starting join game process:", {
                joinCode: code,
                publicKey: publicKey.toBase58(),
                betAmount: betAmount
            });

            // Check if we have enough SOL for the transaction
            const balance = await connection.getBalance(publicKey);
            if (balance < 1000000) { // 0.001 SOL for fees
                throw new Error('Insufficient SOL balance for transaction fees.');
            }

            const program = await getProgramFromWallet({
                publicKey,
                disconnect,
                signTransaction,
            });
            
            // Convert join code to bytes and then to number array
            const joinCodeBytes = Array.from(new TextEncoder().encode(code.padEnd(8, '\0')).slice(0, 8));
            
            // Derive the game PDA
            const [gamePda] = await PublicKey.findProgramAddress(
                [Buffer.from("game"), Buffer.from(joinCodeBytes)],
                program.programId
            );

            // Check if the game exists and is in the correct state before joining
            try {
                const existingGame = await program.account.game.fetch(gamePda);
                console.log("Existing game state:", existingGame);
                
                // Check if game is in waiting state
                if (existingGame.status.waiting === undefined) {
                    throw new Error('Game is not in waiting state. It may have already started or been completed.');
                }
                
                // Check if player2 is already set
                if (existingGame.player2 !== null) {
                    throw new Error('A second player has already joined this game.');
                }
                
                // Check if player is trying to join their own game
                if (existingGame.player1.equals(publicKey)) {
                    throw new Error('You cannot join your own game.');
                }
                
                // Check if game has timed out
                const now = Math.floor(Date.now() / 1000);
                const timeSinceCreation = now - Number(existingGame.createdAt);
                if (timeSinceCreation >= 3600) { // 1 hour timeout
                    throw new Error('Game has timed out.');
                }
                
            } catch (fetchError: unknown) {
                if (fetchError instanceof Error && fetchError.message.includes('Account does not exist')) {
                    throw new Error('Game with this join code does not exist.');
                }
                throw fetchError;
            }

            const tx = await program.methods
                .joinGame()
                .accounts({
                    game: gamePda,
                    player2: publicKey,
                    systemProgram: SystemProgram.programId,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any)
                .transaction();

            // Sign and send transaction manually
            const latestBlockhash = await connection.getLatestBlockhash();
            if (!signTransaction) {
                throw new Error('Wallet does not support transaction signing');
            }
            tx.recentBlockhash = latestBlockhash.blockhash;
            tx.feePayer = publicKey;
            
            const signedTx = await signTransaction(tx);
            const txId = await connection.sendRawTransaction(signedTx.serialize());
            
            // Confirm using polling
            let confirmation = null;
            let retries = 0;
            const maxRetries = 30;
            
            while (retries < maxRetries) {
                try {
                    const status = await connection.getSignatureStatus(txId);
                    if (status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized') {
                        confirmation = status;
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
            
            if (!confirmation) {
                throw new Error('Transaction confirmation timeout');
            }

            console.log("Join transaction successful:", txId);

            // Verify that the player actually joined by fetching the updated game state
            setFeedbackOnce({ type: 'info', message: 'Verifying join...' });
            
            // Wait a moment for the transaction to be fully processed
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Fetch the updated game state to verify the join
            const updatedGameState = await program.account.game.fetch(gamePda);
            console.log("Updated game state after join:", updatedGameState);
            
            // Check if the player actually joined
            const playerActuallyJoined = updatedGameState.player2 && 
                                        updatedGameState.player2.equals(publicKey) &&
                                        updatedGameState.status.inProgress !== undefined;
            
            if (!playerActuallyJoined) {
                throw new Error('Join verification failed - player was not added to the game');
            }

            setGameJoinCode(code);
            setJoinCode('');
            setJoinFeedbackShown(true);
            setFeedbackOnce({ type: 'success', message: `Successfully joined game "${code}"!` });
            clearFeedback();

        } catch (error: unknown) {
            console.error("Failed to join game:", error);
            let errorMessage = 'Failed to join game. ';
            if (error instanceof Error && error.message) {
                errorMessage += error.message;
            } else if (typeof error === 'string') {
                errorMessage += error;
            } else {
                errorMessage += 'Unknown error occurred.';
            }
            setFeedbackOnce({ type: 'error', message: errorMessage });
        } finally {
            setIsJoining(false);
        }
    }, [publicKey, connected, disconnect, joinCode, connection, signTransaction, setFeedbackOnce]);

    const handleCommitMove = useCallback(async (move: number) => {
        if (!gameJoinCode) {
            setFeedbackOnce({ type: 'error', message: 'No active game to commit move to.' });
            return;
        }

        // Check if game is in progress
        if (!gameState || !gameState.status?.inProgress) {
            setFeedbackOnce({ type: 'error', message: 'Game is not in progress. Please wait for both players to join.' });
            return;
        }

        // Check if player has already committed
        if (gameState && publicKey) {
            const isPlayer1 = gameState.player1?.equals(publicKey);
            const isPlayer2 = gameState.player2?.equals(publicKey);
            const hasCommitted = (isPlayer1 && gameState.player1_commit) || 
                               (isPlayer2 && gameState.player2_commit);
            
            if (hasCommitted) {
                setFeedbackOnce({ type: 'info', message: 'You have already committed a move. Waiting for opponent...' });
                return;
            }
        }

        try {
            // Generate random salt (must be >= 1000000 as per smart contract)
            const salt = new BN(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1000000);
            
            // Create hash of move + salt using proper keccak hashing
            // The smart contract expects: keccak(move_bytes + salt_bytes)
            const moveBytes = new Uint8Array([move]);
            const saltBytes = salt.toArray('le', 8);
            const combined = new Uint8Array([...moveBytes, ...saltBytes]);
            
            // Use crypto-js for keccak hashing (same as smart contract)
            const wordArray = CryptoJS.lib.WordArray.create(combined);
            const hashHex = CryptoJS.SHA3(wordArray, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
            const hash = new Uint8Array(Buffer.from(hashHex, 'hex'));
            
            // Debug logging
            console.log("Hash generation:", {
                move,
                salt: salt.toString(),
                moveBytes: Array.from(moveBytes),
                saltBytes: Array.from(saltBytes),
                combined: Array.from(combined),
                hashHex,
                hash: Array.from(hash)
            });

            // Set local state BEFORE committing to ensure it's available for auto-reveal
            setCommittedSalt(salt);
            setCommittedMove(move);
            setHasRevealed(null); // Reset reveal state for new round

            setFeedbackOnce({ type: 'info', message: 'Committing your move...' });
            await commitMove(hash);
            setFeedbackOnce({ type: 'success', message: 'Move committed successfully! Waiting for opponent...' });
        } catch (error: unknown) {
            // Reset local state on error
            setCommittedSalt(null);
            setCommittedMove(null);
            setHasRevealed(null);
            setFeedbackOnce({ type: 'error', message: `Failed to commit move: ${error instanceof Error ? error.message : 'Unknown error'}` });
        }
    }, [gameJoinCode, commitMove, setFeedbackOnce, gameState, publicKey]);

    // Auto-reveal when both players have committed
    useEffect(() => {
        const autoReveal = async () => {
            console.log("Auto-reveal check:", {
                gameState: !!gameState,
                committedSalt: !!committedSalt,
                committedMove: committedMove,
                publicKey: !!publicKey,
                player1Commit: !!gameState?.player1_commit,
                player2Commit: !!gameState?.player2_commit,
                player1Move: !!gameState?.player1_move,
                player2Move: !!gameState?.player2_move,
                isAutoRevealing,
                hasRevealed
            });
            
            if (!gameState || !committedSalt || committedMove === null || !publicKey || !gameJoinCode) return;
            
            const bothCommitted = gameState.player1_commit && gameState.player2_commit;
            const movesRevealed = gameState.player1_move && gameState.player2_move;
            const isCurrentPlayer = bothCommitted;
            
            console.log("Auto-reveal conditions:", {
                bothCommitted,
                movesRevealed,
                isCurrentPlayer,
                isAutoRevealing,
                hasRevealed
            });
            
            // Prevent duplicate reveals and race conditions
            if (bothCommitted && !movesRevealed && isCurrentPlayer && !isAutoRevealing && hasRevealed !== publicKey.toBase58()) {
                // Allow both players to reveal their moves
                console.log("Starting auto-reveal...");
                try {
                    setIsAutoRevealing(true);
                    setFeedbackOnce({ type: 'info', message: 'Both players committed! Auto-revealing moves...' });
                    await revealMove(committedMove, committedSalt);
                    console.log("Auto-reveal successful");
                    setHasRevealed(publicKey.toBase58()); // Only set after successful reveal
                    setFeedbackOnce({ type: 'success', message: 'Moves revealed! Round result will be shown shortly.' });
                } catch (error: unknown) {
                    console.error("Auto-reveal failed:", error);
                    setHasRevealed(null); // Reset on error to allow retry
                    setFeedbackOnce({ type: 'error', message: `Failed to auto-reveal: ${error instanceof Error ? error.message : 'Unknown error'}` });
                } finally {
                    setIsAutoRevealing(false);
                }
            }
        };

        autoReveal();
    }, [gameState?.player1_commit, gameState?.player2_commit, gameState?.player1_move, gameState?.player2_move, committedSalt, committedMove, publicKey, revealMove, setFeedbackOnce, isAutoRevealing, hasRevealed, gameJoinCode]);

    // Reset reveal state when new round starts (no commits and no moves)
    useEffect(() => {
        if (gameState && !gameState.player1_commit && !gameState.player2_commit && !gameState.player1_move && !gameState.player2_move) {
            setHasRevealed(null);
            setIsAutoRevealing(false);
            setCommittedSalt(null);
            setCommittedMove(null);
        }
    }, [gameState?.player1_commit, gameState?.player2_commit, gameState?.player1_move, gameState?.player2_move]);

    // Enhanced move tracking feedback
    useEffect(() => {
        if (!gameState || !publicKey || isAutoRevealing || !gameJoinCode) return;
        
        const isCurrentPlayer = gameState.player1?.equals(publicKey) || gameState.player2?.equals(publicKey);
        
        if (!isCurrentPlayer) return;
        
        // Track move commitments
        const hasCommitted = (gameState.player1?.equals(publicKey) && gameState.player1_commit) || 
                           (gameState.player2?.equals(publicKey) && gameState.player2_commit);
        const opponentCommitted = (gameState.player1?.equals(publicKey) && gameState.player2_commit) || 
                                (gameState.player2?.equals(publicKey) && gameState.player1_commit);
        
        // Show detailed move status (but don't interfere with auto-reveal)
        if (hasCommitted && opponentCommitted && hasRevealed !== publicKey.toBase58()) {
            setFeedbackOnce({ 
                type: 'info', 
                message: '🎯 Both players have committed their moves! Auto-revealing...' 
            });
        } else if (hasCommitted && !opponentCommitted) {
            setFeedbackOnce({ 
                type: 'info', 
                message: '✅ Your move is committed! Waiting for opponent...' 
            });
        } else if (!hasCommitted && opponentCommitted) {
            setFeedbackOnce({ 
                type: 'warning', 
                message: '⏰ Opponent is waiting for your move! Make your selection.' 
            });
        }
    }, [gameState?.player1_commit, gameState?.player2_commit, publicKey, setFeedbackOnce, isAutoRevealing, hasRevealed, gameJoinCode]);

    // Turn notification system
    useEffect(() => {
        if (!gameState || !publicKey || isAutoRevealing || !gameJoinCode) return;
        
        const isCurrentPlayer = gameState.player1?.equals(publicKey) || gameState.player2?.equals(publicKey);
        
        if (!isCurrentPlayer) return;
        
        const hasCommitted = (gameState.player1?.equals(publicKey) && gameState.player1_commit) || 
                           (gameState.player2?.equals(publicKey) && gameState.player2_commit);
        const opponentCommitted = (gameState.player1?.equals(publicKey) && gameState.player2_commit) || 
                                (gameState.player2?.equals(publicKey) && gameState.player1_commit);
        const bothCommitted = gameState.player1_commit && gameState.player2_commit;
        const movesRevealed = gameState.player1_move && gameState.player2_move;
        
        // Show feedback when both players have committed but not yet revealed
        if (bothCommitted && !movesRevealed) {
            setFeedbackOnce({ type: 'info', message: 'Both players have committed! Waiting for reveal...' });
        }
        
        // Your turn notification (only if moves are not revealed yet)
        if (!hasCommitted && opponentCommitted && !movesRevealed && hasRevealed !== publicKey.toBase58() && !showNextRoundCountdown) {
            setFeedbackOnce({ 
                type: 'warning', 
                message: '🎯 YOUR TURN! Opponent has made their move. Select your move now!' 
            });
        }
        
        // Round complete notification (only show once per round)
        if (movesRevealed && gameState.player1_move && gameState.player2_move && !showNextRoundCountdown) {
            const player1Move = gameState.player1_move.rock ? 0 : gameState.player1_move.paper ? 1 : 2;
            const player2Move = gameState.player2_move.rock ? 0 : gameState.player2_move.paper ? 1 : 2;
            const winner = getRoundWinner(player1Move, player2Move);
            const roundNum = gameState.total_rounds || 1;
            if (!shownRounds.has(roundNum)) {
                setFeedbackOnce({ 
                    type: 'success', 
                    message: `🏆 Round ${roundNum} Complete: ${winner === 'Tie' ? 'It\'s a tie!' : winner + ' wins!'}` 
                });
                setShownRounds(prev => new Set(prev).add(roundNum));
            }
        }
    }, [gameState?.player1_commit, gameState?.player2_commit, gameState?.player1_move, gameState?.player2_move, publicKey, setFeedbackOnce, isAutoRevealing, hasRevealed, showNextRoundCountdown, gameJoinCode, shownRounds]);

    // Monitor for player joins
    useEffect(() => {
        if (!gameState || !publicKey || !gameJoinCode) return;
        
        const isCurrentPlayer = gameState.player1?.equals(publicKey) || gameState.player2?.equals(publicKey);
        
        if (!isCurrentPlayer) return;
        
        // Check if someone just joined (we have both players now) and feedback hasn't been shown yet
        if (gameState.player1 && gameState.player2 && !joinFeedbackShown) {
            const opponentAddress = gameState.player1?.equals(publicKey) ? gameState.player2 : gameState.player1;
            const opponentName = gameState.player1?.equals(publicKey) ? 'Player 2' : 'Player 1';
            
            // Only show notification if we're actively in the game room and the game is in progress
            // Also, don't show the notification to the player who just joined (they already know they joined)
            if (gameJoinCode && gameState.status?.inProgress && !isJoining) {
                // Add a small delay to ensure the join process is completely finished
                setTimeout(() => {
                    setFeedbackOnce({ 
                        type: 'success', 
                        message: `🎉 ${opponentName} joined the game! (${opponentAddress?.toBase58().slice(0, 8)}...)` 
                    });
                    setJoinFeedbackShown(true); // Mark that join feedback has been shown
                }, 1000); // 1 second delay
            }
        }
    }, [gameState?.player2, publicKey, setFeedbackOnce, joinFeedbackShown, gameJoinCode, gameState?.status, isJoining]);

    // Reset join feedback flag when game changes
    useEffect(() => {
        setJoinFeedbackShown(false);
        setRoundResults([]);
        setCommittedSalt(null);
        setCommittedMove(null);
        setHasRevealed(null);
        setIsAutoRevealing(false);
        setShowNextRoundCountdown(false);
        setLastRoundResult(null);
        setShownRounds(new Set());
    }, [gameJoinCode]);

    // Auto-clear gameJoinCode when game is completed and closed
    useEffect(() => {
        // Only auto-exit if the game was completed (not just missing)
        if (
            gameJoinCode &&
            !gameLoading &&
            gameState &&
            gameState.status &&
            gameState.status.completed
        ) {
            const timer = setTimeout(() => {
                setGameJoinCode('');
                setLastRoundResult(null);
                setShownFeedbackMessages(new Set());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [gameJoinCode, gameState, gameLoading]);

    // Exit room function - returns to create room UI
    const handleExitRoom = useCallback(() => {
        setGameJoinCode('');
        setJoinCode('');
        setRoundResults([]);
        setCommittedSalt(null);
        setCommittedMove(null);
        setHasRevealed(null);
        setIsAutoRevealing(false);
        setJoinFeedbackShown(false);
        setShowNextRoundCountdown(false);
        setShownFeedbackMessages(new Set());
        setLastRoundResult(null);
    }, []);

    // Helper function to determine round winner
    const getRoundWinner = (move1: number, move2: number): string => {
        if (move1 === move2) return 'Tie';
        if ((move1 + 1) % 3 === move2) return 'Player 2';
        return 'Player 1';
    };

    // Helper function to get move name
    const getMoveName = (move: number): string => {
        switch (move) {
            case 0: return 'Rock';
            case 1: return 'Paper';
            case 2: return 'Scissors';
            default: return 'Unknown';
        }
    };

    const handleCopyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(gameJoinCode);
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        } catch (error) {
            console.error('Failed to copy room ID:', error);
            setCopyStatus('Failed');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        }
    };

    // Handle round completion and start next round timer
    useEffect(() => {
        if (gameState && gameState.player1_move && gameState.player2_move) {
            const movesRevealed = gameState.player1_move && gameState.player2_move;
            const bothCommitted = gameState.player1_commit && gameState.player2_commit;
            
            // If moves are revealed and both committed, start next round timer (only if not the final round)
            if (movesRevealed && bothCommitted && (gameState.total_rounds || 0) < 3) {
                // Only start timer if not already showing countdown
                if (!showNextRoundCountdown) {
                    setShowNextRoundCountdown(true);
                }
            }
        }
    }, [gameState?.player1_move, gameState?.player2_move, gameState?.player1_commit, gameState?.player2_commit, gameState?.total_rounds, showNextRoundCountdown]);

    // Handle round completion and calculate results
    useEffect(() => {
        // Only process if we have valid moves and the game is actually in progress
        if (gameState && 
            gameState.player1_move && 
            gameState.player2_move && 
            gameState.status?.inProgress) {
            
            console.log("Round completion detected:", {
                total_rounds: gameState.total_rounds,
                player1_move: gameState.player1_move,
                player2_move: gameState.player2_move,
                rounds_won_p1: gameState.rounds_won_p1,
                rounds_won_p2: gameState.rounds_won_p2,
                status: gameState.status
            });
            
            // Calculate the current round number correctly
            // When moves are revealed, this is the round that just completed
            // If total_rounds is 1, this means round 1 just completed
            // If total_rounds is 2, this means round 2 just completed
            const currentRound = gameState.total_rounds || 1;
            const player1Move = gameState.player1_move.rock ? 0 : gameState.player1_move.paper ? 1 : 2;
            const player2Move = gameState.player2_move.rock ? 0 : gameState.player2_move.paper ? 1 : 2;
            const roundWinner = getRoundWinner(player1Move, player2Move);
            
            console.log("Calculated round result:", {
                currentRound,
                player1Move: getMoveName(player1Move),
                player2Move: getMoveName(player2Move),
                roundWinner
            });
            
            // Add round result if not already added
            const roundResult = {
                round: currentRound,
                player1Move: getMoveName(player1Move),
                player2Move: getMoveName(player2Move),
                winner: roundWinner
            };
            
            // Store the last round result for persistent display
            setLastRoundResult({
                round: currentRound,
                player1Move: getMoveName(player1Move),
                player2Move: getMoveName(player2Move),
                winner: roundWinner,
                p1Score: gameState.rounds_won_p1 || 0,
                p2Score: gameState.rounds_won_p2 || 0
            });
            
            setRoundResults(prev => {
                console.log("Current round results:", prev);
                // Check if this round result is already in the array
                const exists = prev.some(result => result.round === currentRound);
                if (!exists) {
                    console.log("Adding round result:", roundResult);
                    return [...prev, roundResult];
                } else {
                    console.log("Round result already exists for round:", currentRound);
                }
                return prev;
            });
        }
    }, [gameState?.player1_move, gameState?.player2_move, gameState?.total_rounds, gameState?.rounds_won_p1, gameState?.rounds_won_p2, gameState?.status]);

    // Claim winnings function - Fixed to handle PDA data issue
    const handleClaimWinnings = useCallback(async () => {
        if (!gameJoinCode || !publicKey || !connected || !disconnect) {
            setFeedbackOnce({ type: 'error', message: 'Please connect your wallet first.' });
            return;
        }

        setIsLoading(true);
        setFeedbackOnce({ type: 'info', message: 'Claiming winnings...' });

        try {
            const program = await getProgramFromWallet({
                publicKey,
                disconnect,
                signTransaction,
            });
            
            // Convert join code to bytes
            const joinCodeBytes = Array.from(new TextEncoder().encode(gameJoinCode.padEnd(8, '\0')).slice(0, 8));
            
            // Derive the game PDA
            const [gamePda] = await PublicKey.findProgramAddress(
                [Buffer.from("game"), Buffer.from(joinCodeBytes)],
                program.programId
            );

            // Create the transaction with proper account structure
            const tx = await program.methods
                .claimWinnings()
                .accounts({
                    game: gamePda,
                    winner: publicKey,
                    systemProgram: SystemProgram.programId,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any)
                .transaction();

            // Sign and send transaction manually
            const latestBlockhash = await connection.getLatestBlockhash();
            if (!signTransaction) {
                throw new Error('Wallet does not support transaction signing');
            }
            tx.recentBlockhash = latestBlockhash.blockhash;
            tx.feePayer = publicKey;
            
            const signedTx = await signTransaction(tx);
            const txId = await connection.sendRawTransaction(signedTx.serialize());
            
            // Confirm using polling
            let confirmation = null;
            let retries = 0;
            const maxRetries = 30;
            
            while (retries < maxRetries) {
                try {
                    const status = await connection.getSignatureStatus(txId);
                    if (status.value?.confirmationStatus === 'confirmed' || status.value?.confirmationStatus === 'finalized') {
                        confirmation = status;
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
            
            if (!confirmation) {
                throw new Error('Transaction confirmation timeout');
            }

            setFeedbackOnce({ type: 'success', message: 'Winnings claimed! Returning to lobby.' });
            handleExitRoom();

        } catch (error: unknown) {
            console.error("Failed to claim winnings:", error);
            
            // Safely extract error details
            const errorDetails = {
                message: error instanceof Error ? error.message : 'Unknown error',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                logs: Array.isArray((error as any)?.logs) ? (error as any).logs : [],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                error: (error as any)?.error,
                stack: error instanceof Error ? error.stack : undefined
            };
            
            console.error("Error details:", errorDetails);
            
            let errorMessage = 'Failed to claim winnings. ';
            
            if (error instanceof Error) {
                if (error.message?.includes('insufficient funds')) {
                    errorMessage += 'Insufficient SOL for transaction fees.';
                } else if (error.message?.includes('Game not completed')) {
                    errorMessage += 'Game is not completed yet.';
                } else if (error.message?.includes('Not the winner')) {
                    errorMessage += 'Only the winner can claim winnings.';
                } else if (error.message?.includes('Already claimed')) {
                    errorMessage += 'Winnings have already been claimed.';
                } else if (error.message?.includes('invalid program argument')) {
                    errorMessage += 'Smart contract error. The game account may have data that prevents direct transfer.';
                } else if (error.message?.includes('Account does not exist') || error.message?.includes('AccountNotInitialized')) {
                    errorMessage += 'Game account not found. The game may have been closed already.';
                } else if (error.message?.includes('0x1770') || error.message?.includes('6000')) {
                    errorMessage += 'Game is not in completed state.';
                } else if (error.message?.includes('0x1771') || error.message?.includes('6001')) {
                    errorMessage += 'You are not the winner of this game.';
                } else if (error.message?.includes('0x1772') || error.message?.includes('6002')) {
                    errorMessage += 'Winnings have already been claimed.';
                } else if (error.message?.includes('0x1773') || error.message?.includes('6003')) {
                    errorMessage += 'Game has timed out.';
                } else if (error.message?.includes('0xbc4') || error.message?.includes('3012')) {
                    errorMessage += 'Game account is not initialized. The game may have been closed already.';
                } else if ((error as unknown as { logs?: string[] })?.logs) {
                    const logs = (error as unknown as { logs: string[] }).logs;
                    console.log("Contract logs:", logs);
                    if (logs.some(log => log.includes('Game not completed'))) {
                        errorMessage += 'Game is not completed yet.';
                    } else if (logs.some(log => log.includes('Not the winner'))) {
                        errorMessage += 'Only the winner can claim winnings.';
                    } else if (logs.some(log => log.includes('Already claimed'))) {
                        errorMessage += 'Winnings have already been claimed.';
                    } else if (logs.some(log => log.includes('AccountNotInitialized'))) {
                        errorMessage += 'Game account is not initialized. The game may have been closed already.';
                    } else {
                        errorMessage += `Contract error: ${logs.join(', ')}`;
                    }
                } else {
                    errorMessage += error.message || 'Unknown error occurred.';
                }
            }
            
            setFeedbackOnce({ type: 'error', message: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }, [gameJoinCode, publicKey, connected, disconnect, connection, signTransaction, handleExitRoom]);

    // Cleanup effect to prevent memory leaks
    useEffect(() => {
        return () => {
            // Clear any pending timeouts when component unmounts
            setShowNextRoundCountdown(false);
            setCommittedSalt(null);
            setCommittedMove(null);
            setHasRevealed(null);
            setIsAutoRevealing(false);
            setJoinFeedbackShown(false);
            setRoundResults([]);
        };
    }, []);

    // Auto-redirect when game state becomes null (account closed)
    useEffect(() => {
        if (gameJoinCode && !gameState && !gameLoading) {
            if (!missingGameSince) {
                setMissingGameSince(Date.now());
                setFeedbackOnce({ type: 'warning', message: 'Game not found. Retrying...' });
            } else if (Date.now() - missingGameSince > 10000) { // 10 seconds grace
                setFeedbackOnce({ type: 'error', message: 'Game closed or not found. Returning to lobby.' });
                handleExitRoom();
                setMissingGameSince(null);
            }
        } else {
            if (missingGameSince) setMissingGameSince(null); // Reset if gameState returns
        }
    }, [gameState, gameJoinCode, gameLoading, handleExitRoom, missingGameSince, setFeedbackOnce]);

    // Debug logging for game state changes
    useEffect(() => {
        if (gameState) {
            console.log("Game state changed:", {
                joinCode: gameJoinCode,
                status: gameState.status,
                player1_move: gameState.player1_move,
                player2_move: gameState.player2_move,
                total_rounds: gameState.total_rounds,
                rounds_won_p1: gameState.rounds_won_p1,
                rounds_won_p2: gameState.rounds_won_p2,
                player1_commit: gameState.player1_commit,
                player2_commit: gameState.player2_commit
            });
        }
    }, [gameState, gameJoinCode]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const showTimerWarning = !!(gameState && gameState.player1 && gameState.player2 && gameState.status?.inProgress);

    const handleDisconnect = async () => {
        try {
            setIsDisconnecting(true);
            await disconnect();
        } catch (error) {
            console.error('Failed to disconnect:', error);
        } finally {
            setIsDisconnecting(false);
        }
    };
    
    // UI Rendering
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start font-mono relative">
            {/* Navbar */}
            <div className="w-full bg-gray-800/90 backdrop-blur-sm shadow-lg fixed top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-purple-400 truncate">Solana Stone Paper Scissors</h1>
                        <div className="flex items-center gap-3 shrink-0">
                            {!connected ? (
                                <div className="shrink-0">
                                    <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !transition-colors !rounded-lg !h-10 !px-4 !py-2" />
                                </div>
                            ) : (
                                <button
                                    className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-bold rounded-lg border-2 border-purple-500 transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0`}
                                    onClick={handleDisconnect}
                                    disabled={isDisconnecting}
                                >
                                    {isDisconnecting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle 
                                                    className="opacity-25" 
                                                    cx="12" 
                                                    cy="12" 
                                                    r="10" 
                                                    stroke="currentColor" 
                                                    strokeWidth="4"
                                                    fill="none"
                                                />
                                                <path 
                                                    className="opacity-75" 
                                                    fill="currentColor" 
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Disconnecting...
                                        </>
                                    ) : (
                                        'Disconnect'
                                    )}
                                </button>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - with top padding for navbar */}
            <div className="w-full max-w-6xl flex flex-col gap-4 pt-20 px-4 pb-32 min-h-screen overflow-y-auto">
                {!connected ? (
                    <div className="flex flex-col gap-6 items-center justify-center mt-8">
                        {/* Game Info Card */}
                        <div className="w-full max-w-2xl bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
                            <h2 className="text-2xl font-bold text-purple-400 mb-4">Welcome to Solana Stone Paper Scissors!</h2>
                            <div className="space-y-4 text-gray-300">
                                <p className="text-lg">🎮 Play the classic game with a blockchain twist:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Connect your Solana wallet to start</li>
                                    <li>Create a game room with a custom bet amount</li>
                                    <li>Share your room code with friends to play</li>
                                    <li>Best of 3 rounds</li>
                                    <li>Winner takes the entire pot!</li>
                                </ul>
                                <div className="mt-6 p-4 bg-purple-900/30 rounded-lg">
                                    <h3 className="text-lg font-semibold text-purple-400 mb-2">How to Play:</h3>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li>Connect your wallet</li>
                                        <li>Create a game or join with a room code</li>
                                        <li>Choose your move: Rock, Paper, or Scissors</li>
                                        <li>Wait for your opponent</li>
                                        <li>Win 2 rounds to claim the prize!</li>
                                    </ol>
                                </div>
                                <div className="mt-6 text-sm text-purple-300/80">
                                    <p>🔒 Secure & Fair Play:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Moves are committed and revealed on-chain</li>
                                        <li>Smart contract ensures fair gameplay</li>
                                        <li>Automatic prize distribution</li>
                                    </ul>
                                </div>
                                </div>
                            </div>
                        <div className="text-center text-gray-400">
                            Connect your wallet to start playing!
                        </div>
                    </div>
                ) : !gameJoinCode ? (
                    // Create/Join Game Section
                    <div className="max-w-md mx-auto bg-gray-800/90 backdrop-blur-sm rounded-lg p-6">
                        <GameControlButtons
                            gameJoinCode={gameJoinCode}
                            gameState={gameState}
                            publicKey={publicKey}
                            isLoading={isLoading}
                            isCreating={isCreating}
                            isJoining={isJoining}
                            handleInitializeGame={handleInitializeGame}
                            handleJoinGame={handleJoinGame}
                            handleCommitMove={handleCommitMove}
                            handleClaimWinnings={handleClaimWinnings}
                            handleExitRoom={handleExitRoom}
                            handleCopyRoomId={handleCopyRoomId}
                            joinCode={joinCode}
                            setJoinCode={setJoinCode}
                            betAmount={betAmount}
                            setBetAmount={setBetAmount}
                            copyStatus={copyStatus}
                            roundResults={roundResults}
                            roomReady={roomReady}
                            walletReady={connected && !!publicKey}
                        />
                    </div>
                ) : (
                    // Game Room Layout
                    <>
                        {/* Main Game Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                            {/* Left Column - Game Info */}
                            <div className="space-y-4 flex flex-col justify-center">
                                <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-purple-400">Game Room</h2>
                                        <button
                                            onClick={handleExitRoom}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                        >
                                            🚪 Leave
                                        </button>
                            </div>
                                    <GameSummary 
                                    completed={!!gameState?.status?.completed}
                                    p1Wins={gameState?.rounds_won_p1 || 0}
                                    p2Wins={gameState?.rounds_won_p2 || 0}
                                        betAmount={gameState?.bet_amount ? (gameState.bet_amount.toNumber() / 1e9).toFixed(2) : '0.05'}
                                        totalWinnings={gameState?.bet_amount ? ((gameState.bet_amount.toNumber() * 2) / 1e9).toFixed(2) : '0.10'}
                                />
                                    <PlayerInfo 
                                        player1={gameState?.player1?.toString() || null} 
                                        player2={gameState?.player2?.toString() || null} 
                                    />
                                    {/* Room ID and Copy Button */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-sm text-gray-400">Room:</span>
                                        <code className="text-sm bg-gray-700/50 px-2 py-1 rounded">{gameJoinCode}</code>
                                        <button
                                            onClick={handleCopyRoomId}
                                            className="ml-auto px-3 py-1 text-xs rounded bg-purple-600 hover:bg-purple-700 transition-colors"
                                        >
                                            {copyStatus}
                               </button>
                            </div>
                            </div>
                        </div>

                            {/* Center Column - Game Status & Turn Indicator */}
                            <div className="flex flex-col justify-center items-center">
                                <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 w-full max-w-md mx-auto">
                                    <GameStatus status={gameState?.status} />
                                    <div className="mt-4">
                             <TurnIndicator 
                                hasCommitted={(() => {
                                    const isPlayer1 = gameState?.player1?.toString() === publicKey?.toString();
                                    const isPlayer2 = gameState?.player2?.toString() === publicKey?.toString();
                                    return (isPlayer1 && !!gameState?.player1_commit) || 
                                           (isPlayer2 && !!gameState?.player2_commit);
                                })()}
                                opponentCommitted={(() => {
                                    const isPlayer1 = gameState?.player1?.toString() === publicKey?.toString();
                                    const isPlayer2 = gameState?.player2?.toString() === publicKey?.toString();
                                    return (isPlayer1 && !!gameState?.player2_commit) || 
                                           (isPlayer2 && !!gameState?.player1_commit);
                                })()}
                                bothCommitted={!!gameState?.player1_commit && !!gameState?.player2_commit}
                                movesRevealed={!!gameState?.player1_move && !!gameState?.player2_move}
                                player1Commit={!!gameState?.player1_commit}
                                player2Commit={!!gameState?.player2_commit}
                                isYou1={gameState?.player1?.toString() === publicKey?.toString()}
                                isYou2={gameState?.player2?.toString() === publicKey?.toString()}
                            />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Game Progress */}
                            <div className="space-y-4 flex flex-col justify-center">
                                <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                                    <RoundProgress 
                                        round={gameState?.total_rounds || 0}
                                        completed={!!gameState?.status?.completed}
                                        winningsClaimed={!!gameState?.status?.winningsClaimed}
                                        p1Wins={gameState?.rounds_won_p1 || 0}
                                        p2Wins={gameState?.rounds_won_p2 || 0}
                                        finalWinner={(() => {
                                            if (!gameState?.status?.completed) return null;
                                            const p1Wins = gameState.rounds_won_p1 || 0;
                                            const p2Wins = gameState.rounds_won_p2 || 0;
                                            if (p1Wins === p2Wins) return 'Tie';
                                            return p1Wins > p2Wins ? 'Player 1' : 'Player 2';
                                        })()}
                                    />
                                </div>
                            {gameState?.player1_move && gameState?.player2_move && (
                                    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                                <GameCompletion
                                    gameJoinCode={gameJoinCode}
                                    gameState={gameState}
                                    betAmount={gameState.bet_amount ? gameState.bet_amount.toNumber() / 1e9 : 0.05}
                                    publicKey={publicKey}
                                    handleClaimWinnings={handleClaimWinnings}
                                    winningsClaimed={gameState.status?.winningsClaimed}
                                />
                            </div>
                        )}
                            </div>
                                    </div>
                                    
                        {/* Game Controls */}
                        <div className="mt-6 mb-8">
                            <div className="max-w-xs mx-auto">
                                <div className="bg-gray-800/95 backdrop-blur-md rounded-lg p-4 shadow-lg border border-purple-500/20">
                                    <CommitMove isLoading={isLoading} handleCommitMove={handleCommitMove} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Bottom right notification and network status */}
            <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
                <div className="max-w-md w-full pointer-events-auto mb-2">
                    <Feedback feedback={feedback} onClose={() => setFeedback(null)} />
                </div>
                {connected && connection?.rpcEndpoint === 'https://rpc.gorbagana.wtf' && (
                    <div className="pointer-events-auto">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-green-400">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            <span className="text-xs font-bold text-white tracking-wide">
                                Connected to <span className="text-green-200">Gorbagana</span> testnet
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameArena;