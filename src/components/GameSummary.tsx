import React from 'react';

interface GameSummaryProps {
    completed: boolean;
    p1Wins: number;
    p2Wins: number;
    betAmount: string;
    totalWinnings: string;
    isTie?: boolean;
}

const GameSummary: React.FC<GameSummaryProps> = ({ completed, p1Wins, p2Wins, betAmount, totalWinnings, isTie }) => (
    completed ? (
        <div className="bg-gray-700 p-3 rounded">
            <p className="font-semibold">Game Complete!</p>
            <p className="text-gray-300">
                {p1Wins > p2Wins ? 'Player 1 wins the game!' : 
                 p2Wins > p1Wins ? 'Player 2 wins the game!' : 
                 'Game tied'}
            </p>
            <p className="text-sm text-gray-400">
                Bet amount: {betAmount} SOL
            </p>
            <p className="text-sm text-yellow-400 font-semibold">
                {isTie ? 'Refund Amount' : '🏆 Total Winnings'}: {totalWinnings} SOL
            </p>
        </div>
    ) : null
);

export default GameSummary; 