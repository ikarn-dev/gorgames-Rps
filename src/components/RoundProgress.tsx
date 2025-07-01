import React from 'react';

interface RoundProgressProps {
    round: number;
    completed: boolean;
    winningsClaimed: boolean;
    p1Wins: number;
    p2Wins: number;
    finalWinner: string | null;
}

const RoundProgress: React.FC<RoundProgressProps> = ({ round, completed, winningsClaimed, p1Wins, p2Wins, finalWinner }) => {
    const totalRounds = 3;
    const currentRound = completed || winningsClaimed ? round : round + 1;
    const progressPercent = Math.min((currentRound / totalRounds) * 100, 100);
    return (
        <div className="bg-gradient-to-br from-gray-800 to-purple-900 p-5 rounded-2xl shadow border-2 border-purple-700/30">
            <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-purple-300">🏆 Round Progress
                </span>
                <span className="text-sm text-gray-300">{currentRound}/{totalRounds}</span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 to-yellow-400 transition-all"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-200 font-semibold">P1 Wins: {p1Wins}</span>
                <span className="text-purple-200 font-semibold">P2 Wins: {p2Wins}</span>
            </div>
            <div className="text-xs text-yellow-400 mt-1">
                🏆 First to 2 out of 3 rounds wins!
            </div>
            {completed && finalWinner && (
                <div className="mt-3 p-2 bg-yellow-900 rounded border border-yellow-600 text-center">
                    <span className="text-yellow-400 font-bold text-lg">
                        🏆 {finalWinner === 'Tie' ? 'Match ended in a tie!' : `${finalWinner} wins the match!`}
                    </span>
                </div>
            )}
        </div>
    );
};

export default RoundProgress; 