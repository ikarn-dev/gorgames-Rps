import React from 'react';

interface GameStatusProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: any;
}

const GameStatus: React.FC<GameStatusProps> = ({ status }) => (
    <div className="bg-gray-700 p-3 rounded">
        <p className="font-semibold">Game Status</p>
        <p className="text-gray-300">
            {status?.waiting ? 'Waiting for player 2' :
             status?.inProgress ? 'In Progress' :
             status?.completed ? 'Completed' :
             status?.winningsClaimed ? 'Winnings Claimed' : 'Unknown'}
        </p>
    </div>
);

export default GameStatus; 