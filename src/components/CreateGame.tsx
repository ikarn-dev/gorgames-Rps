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
}

const CreateGame: React.FC<CreateGameProps> = ({
    joinCode,
    setJoinCode,
    betAmount,
    setBetAmount,
    isLoading,
    isCreating,
    isJoining,
    handleInitializeGame,
    handleJoinGame
}) => (
    <div className="p-4 border border-gray-600 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Create or Join Game</h2>
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="flex-1 bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    disabled={isLoading}
                    maxLength={8}
                />
                <select
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    disabled={isLoading}
                >
                    <option value="0.05">0.05 SOL</option>
                    <option value="0.1">0.1 SOL</option>
                    <option value="0.5">0.5 SOL</option>
                    <option value="1">1 SOL</option>
                </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleInitializeGame}
                    disabled={isCreating || isJoining}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-bold disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isCreating ? 'Creating...' : 'Create Game'}
                </button>
                <button
                    onClick={handleJoinGame}
                    disabled={isCreating || isJoining}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isJoining ? 'Joining...' : 'Join Game'}
                </button>
            </div>
        </div>
    </div>
);

export default CreateGame; 