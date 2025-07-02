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
    <div className="bg-gradient-to-br from-purple-800 to-[#181c2f] p-2 rounded-lg shadow flex flex-col gap-2 border border-purple-500/40">
        <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg flex flex-col items-center border border-purple-500/40">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-base font-bold mb-1 border-2 border-purple-400/60">
                    {getInitials(player1)}
                </div>
                <p className="font-semibold text-purple-300 text-xs">Player 1</p>
                <p className="text-gray-200 font-mono text-[10px] mt-0.5">
                    {player1 ? player1.slice(0, 8) + '...' : 'Unknown'}
                </p>
            </div>
            <div className="p-2 rounded-lg flex flex-col items-center border border-blue-500/40">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-base font-bold mb-1 border-2 border-blue-400/60">
                    {getInitials(player2)}
                </div>
                <p className="font-semibold text-blue-300 text-xs">Player 2</p>
                <p className="text-gray-200 font-mono text-[10px] mt-0.5">
                    {player2 ? player2.slice(0, 8) + '...' : 'Waiting...'}
                </p>
            </div>
        </div>
    </div>
);

export default PlayerInfo; 