import React from 'react';

interface GameStatusProps {
    status: any;
}

type StatusKey = 'waiting' | 'inProgress' | 'completed' | 'winningsClaimed' | 'unknown';

const statusMap: Record<StatusKey, { icon: string; label: string; color: string }> = {
    waiting: {
        icon: '⏳',
        label: 'Waiting for Player 2',
        color: 'text-yellow-400',
    },
    inProgress: {
        icon: '🎯',
        label: 'Game In Progress',
        color: 'text-blue-400',
    },
    completed: {
        icon: '🏁',
        label: 'Game Completed',
        color: 'text-green-400',
    },
    winningsClaimed: {
        icon: '💰',
        label: 'Winnings Claimed',
        color: 'text-green-300',
    },
    unknown: {
        icon: '❓',
        label: 'Unknown',
        color: 'text-gray-400',
    },
};

const GameStatus: React.FC<GameStatusProps> = ({ status }) => {
    let state: StatusKey = 'unknown';
    if (status?.waiting) state = 'waiting';
    else if (status?.inProgress) state = 'inProgress';
    else if (status?.completed) state = 'completed';
    else if (status?.winningsClaimed) state = 'winningsClaimed';

    const { icon, label, color } = statusMap[state];

    return (
        <div className="bg-gradient-to-br from-gray-800 to-purple-900 p-4 rounded-xl shadow border border-purple-700/30 flex items-center gap-3">
            <span className={`text-2xl ${color}`}>{icon}</span>
            <div>
                <p className="font-semibold text-purple-200 text-lg">Game Status</p>
                <p className={`font-mono text-sm ${color}`}>{label}</p>
            </div>
        </div>
    );
};

export default GameStatus; 