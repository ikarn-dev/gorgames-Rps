import React from 'react';

interface CreateGameProps {
    joinCode: string;
    setJoinCode: (code: string) => void;
    betAmount: string;
    setBetAmount: (amount: string) => void;
    isLoading: boolean;
    isCreating: boolean;
    isJoining: boolean;
    handleInitializeGame: () => void;
    handleJoinGame: () => void;
    roomReady: boolean;
    walletReady: boolean;
}

const CreateGame: React.FC<CreateGameProps> = ({
    joinCode,
    setJoinCode,
    isLoading,
    isCreating,
    isJoining,
    handleInitializeGame,
    handleJoinGame,
    walletReady
}) => (
    <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-gray-900 to-purple-900 border-2 border-purple-700/40 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-purple-200 text-center">Create or Join a Game Room</h2>
        <div className="space-y-4">
            <div className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Enter Room ID (max 8 chars)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="flex-1 bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-lg font-mono border border-purple-700/30"
                    disabled={isLoading}
                    maxLength={8}
                />
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-sm">Bet Amount:</span>
                    <span className="bg-purple-700 text-white px-3 py-1 rounded-lg font-bold text-lg shadow border border-purple-500/40">0.05 GOR</span>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                    onClick={handleInitializeGame}
                    disabled={isCreating || isJoining || !walletReady}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-all text-lg shadow"
                >
                    {isCreating ? 'Creating...' : 'Create Game'}
                </button>
                <button
                    onClick={handleJoinGame}
                    disabled={isCreating || isJoining || !walletReady}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-all text-lg shadow"
                >
                    {isJoining ? 'Joining...' : 'Join Game'}
                </button>
            </div>
        </div>
    </div>
);

export default CreateGame; 