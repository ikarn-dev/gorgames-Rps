import React from 'react';

interface RoundProgressProps {
    round: number;
    completed: boolean;
    winningsClaimed: boolean;
    p1Wins: number;
    p2Wins: number;
    finalWinner: string | null;
}

const RoundProgress: React.FC<RoundProgressProps> = ({ round, completed, winningsClaimed, p1Wins, p2Wins, finalWinner }) => (
    <div className="bg-gray-700 p-3 rounded">
        <p className="font-semibold">Round Progress</p>
        <p className="text-gray-300">
            Round {completed || winningsClaimed ? round : round + 1}/3 - Player 1: {p1Wins} wins, Player 2: {p2Wins} wins
        </p>
        <p className="text-xs text-yellow-400 mt-1">
            🏆 First player to win 2 out of 3 rounds wins the game!
        </p>
        {completed && finalWinner && (
            <div className="mt-2 p-2 bg-yellow-900 rounded border border-yellow-600">
                <p className="text-yellow-400 font-bold text-center">
                    🏆 {finalWinner === 'Tie' ? 'Match ended in a tie!' : `${finalWinner} wins the match!`}
                </p>
            </div>
        )}
    </div>
);

export default RoundProgress; 