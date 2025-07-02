import React from 'react';
import { PublicKey } from '@solana/web3.js';
import CreateGame from './CreateGame';
import CommitMove from './CommitMove';
import ClaimWinnings from './ClaimWinnings';
import PlayerInfo from './PlayerInfo';

interface GameControlButtonsProps {
    // Game state props
    gameJoinCode: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameState: any;
    publicKey: PublicKey | null;
    isLoading: boolean;
    isCreating: boolean;
    isJoining: boolean;
    walletReady: boolean;
    
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
    copyStatus: string;
}

export const GameControlButtons: React.FC<GameControlButtonsProps> = ({
    gameJoinCode,
    gameState,
    publicKey,
    isLoading,
    isCreating,
    isJoining,
    walletReady,
    handleInitializeGame,
    handleJoinGame,
    handleCommitMove,
    handleClaimWinnings,
    handleExitRoom,
    handleCopyRoomId,
    joinCode,
    setJoinCode,
    copyStatus,
}) => {
    // Show create/join game controls when no active game
    if (!gameJoinCode || !gameState) {
        return (
            <CreateGame
                joinCode={joinCode}
                setJoinCode={setJoinCode}
                betAmount="0.05"
                setBetAmount={() => {}}
                isLoading={isLoading}
                isCreating={isCreating}
                isJoining={isJoining}
                handleInitializeGame={handleInitializeGame}
                handleJoinGame={handleJoinGame}
                roomReady={false}
                walletReady={walletReady}
            />
        );
    }

    // Show game controls when in active game
    return (
        <div className="bg-gradient-to-br from-purple-800 to-[#181c2f] space-y-3 rounded-lg shadow border border-purple-700/60 flex flex-col gap-2 relative overflow-visible p-3">
            {/* Room ID and Copy Button */}
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm sm:text-base font-extrabold text-purple-200 tracking-wide" style={{fontFamily: 'var(--font-orbitron), \"Courier New\", monospace'}}>Game Room</h3>
                <button
                    onClick={handleExitRoom}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-xs font-bold shadow border border-red-400/60 focus:outline-none focus:ring-1 focus:ring-red-400 cursor-pointer"
                    type="button"
                >
                    🚪 Leave
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs bg-gray-800 px-2 py-1 rounded border border-purple-700/20 text-purple-200 tracking-wider">Room ID</span>
                    <span className="font-mono text-sm bg-gray-700 px-2 py-1 rounded border border-purple-700/30 text-white select-all tracking-widest">{gameJoinCode}</span>
                </div>
                <div className="flex flex-col gap-1 justify-center items-start md:items-end">
                    <button
                        className={`px-3 py-1 text-xs rounded-md font-bold shadow border transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer ${
                            copyStatus === 'Copied!'
                                ? 'bg-green-700 hover:bg-green-600 border-green-400 text-white'
                                : copyStatus === 'Failed'
                                ? 'bg-red-700 hover:bg-red-600 border-red-400 text-white'
                                : 'bg-blue-700 hover:bg-blue-600 border-blue-400 text-white'
                        }`}
                        onClick={handleCopyRoomId}
                        type="button"
                    >
                        {copyStatus}
                    </button>
                </div>
            </div>
            {/* Player Info */}
            <PlayerInfo player1={gameState?.player1?.toString() || null} player2={gameState?.player2?.toString() || null} />
        </div>
    );
}; 