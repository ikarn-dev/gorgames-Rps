import React from 'react';

interface PlayerInfoProps {
    player1: string | null;
    player2: string | null;
}

function getInitials(address: string | null) {
    if (!address) return '?';
    return address.slice(0, 2).toUpperCase();
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player1, player2 }) => (
    <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gradient-to-br from-purple-800 to-gray-800 p-4 rounded-xl shadow flex flex-col items-center border-2 border-purple-500/40">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold mb-2 border-4 border-purple-400/60">
                {getInitials(player1)}
            </div>
            <p className="font-semibold text-purple-300">Player 1</p>
            <p className="text-gray-200 font-mono text-xs mt-1">
                {player1 ? player1.slice(0, 8) + '...' : 'Unknown'}
            </p>
        </div>
        <div className="bg-gradient-to-br from-blue-800 to-gray-800 p-4 rounded-xl shadow flex flex-col items-center border-2 border-blue-500/40">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mb-2 border-4 border-blue-400/60">
                {getInitials(player2)}
            </div>
            <p className="font-semibold text-blue-300">Player 2</p>
            <p className="text-gray-200 font-mono text-xs mt-1">
                {player2 ? player2.slice(0, 8) + '...' : 'Waiting...'}
            </p>
        </div>
    </div>
);

export default PlayerInfo; 