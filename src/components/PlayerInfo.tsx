import React from 'react';

interface PlayerInfoProps {
    player1: string | null;
    player2: string | null;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player1, player2 }) => (
    <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-700 p-3 rounded">
            <p className="font-semibold">Player 1</p>
            <p className="text-gray-300">
                {player1 ? player1.slice(0, 8) + '...' : 'Unknown'}
            </p>
        </div>
        <div className="bg-gray-700 p-3 rounded">
            <p className="font-semibold">Player 2</p>
            <p className="text-gray-300">
                {player2 ? player2.slice(0, 8) + '...' : 'Waiting...'}
            </p>
        </div>
    </div>
);

export default PlayerInfo; 