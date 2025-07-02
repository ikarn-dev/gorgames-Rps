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
        <div className="bg-gradient-to-br from-purple-800 to-[#181c2f] p-2 rounded-md text-xs shadow border border-purple-700/40">
            <p className="font-semibold">Game Complete!</p>
            <p className="text-gray-300">
                {p1Wins > p2Wins ? 'Player 1 wins the game!' : 
                 p2Wins > p1Wins ? 'Player 2 wins the game!' : 
                 'Game tied'}
            </p>
            <p className="text-[10px] text-gray-400">
                Bet amount: {betAmount} GOR
            </p>
            <p className="text-[11px] text-yellow-400 font-semibold">
                {isTie ? 'Refund Amount' : '🏆 Total Winnings'}: {totalWinnings} GOR
            </p>
        </div>
    ) : null
);

export default GameSummary; 