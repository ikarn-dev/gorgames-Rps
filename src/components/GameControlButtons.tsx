import React from 'react';
import { PublicKey } from '@solana/web3.js';
import CreateGame from './CreateGame';
import CommitMove from './CommitMove';
import ClaimWinnings from './ClaimWinnings';

interface GameControlButtonsProps {
    // Game state props
    gameJoinCode: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameState: any;
    publicKey: PublicKey | null;
    isLoading: boolean;
    isCreating: boolean;
    isJoining: boolean;
    roomReady: boolean;
    
    // Button handlers
    handleInitializeGame: () => void;
    handleJoinGame: () => void;
    handleCommitMove: (move: number) => void;
    handleClaimWinnings: () => void;
    handleExitRoom: () => void;
    handleCopyRoomId: () => void;
    
    // Form state
    joinCode: string;
    setJoinCode: (code: string) => void;
    betAmount: string;
    setBetAmount: (amount: string) => void;
    copyStatus: string;
    roundResults: Array<{ round: number; player1Move: string; player2Move: string; winner: string }>;
}

export const GameControlButtons: React.FC<GameControlButtonsProps> = ({
    gameJoinCode,
    gameState,
    publicKey,
    isLoading,
    isCreating,
    isJoining,
    roomReady,
    handleInitializeGame,
    handleJoinGame,
    handleCommitMove,
    handleClaimWinnings,
    handleCopyRoomId,
    joinCode,
    setJoinCode,
    betAmount,
    setBetAmount,
    copyStatus,
}) => {
    // Show create/join game controls when no active game
    if (!gameJoinCode || !gameState) {
        return (
            <CreateGame
                joinCode={joinCode}
                setJoinCode={setJoinCode}
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                isLoading={isLoading}
                isCreating={isCreating}
                isJoining={isJoining}
                handleInitializeGame={handleInitializeGame}
                handleJoinGame={handleJoinGame}
                roomReady={roomReady}
            />
        );
    }

    // Show game controls when in active game
    return (
        <div className="space-y-4">
            {/* Room ID and Copy Button */}
            <div className="p-4 border border-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-200">Game Room</h3>
                <div className="flex items-center gap-3">
                    <span className="font-mono text-sm bg-gray-700 px-3 py-2 rounded flex-1">
                        Room ID: {gameJoinCode}
                    </span>
                    <button
                        className={`px-3 py-2 text-sm rounded transition-colors ${
                            copyStatus === 'Copied!' 
                                ? 'bg-green-700 hover:bg-green-600' 
                                : copyStatus === 'Failed' 
                                ? 'bg-red-700 hover:bg-red-600' 
                                : 'bg-blue-700 hover:bg-blue-600'
                        }`}
                        onClick={handleCopyRoomId}
                    >
                        {copyStatus}
                    </button>
                </div>
            </div>

            {/* Move Buttons - only show during active gameplay */}
            {gameState && gameState.player1 && gameState.player2 && gameState.status?.inProgress && (
                <CommitMove isLoading={isLoading} handleCommitMove={handleCommitMove} />
            )}

            {/* Game Completion Controls */}
            {gameState.status?.completed && (
                <div className="p-4 border border-gray-600 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-gray-200">Game Complete</h3>
                    <ClaimWinnings
                        isWinner={(() => {
                            const isPlayer1 = gameState.player1?.equals(publicKey);
                            const isPlayer2 = gameState.player2?.equals(publicKey);
                            const p1Wins = gameState.rounds_won_p1 || 0;
                            const p2Wins = gameState.rounds_won_p2 || 0;
                            return (isPlayer1 && p1Wins > p2Wins) || (isPlayer2 && p2Wins > p1Wins);
                        })()}
                        isTie={(() => {
                            const p1Wins = gameState.rounds_won_p1 || 0;
                            const p2Wins = gameState.rounds_won_p2 || 0;
                            return p1Wins === p2Wins;
                        })()}
                        betAmount={gameState.bet_amount ? Number(gameState.bet_amount.toNumber() / 1e9) : 0.05}
                        isLoading={isLoading}
                        winningsClaimed={gameState.status?.winningsClaimed}
                        handleClaimWinnings={handleClaimWinnings}
                    />
                </div>
            )}
        </div>
    );
}; 