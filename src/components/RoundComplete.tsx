import React from 'react';

interface RoundCompleteProps {
    round: number;
    player1Move: string;
    player2Move: string;
    winner: string;
    p1Score: number;
    p2Score: number;
    betAmount: string;
    totalWinnings: string;
    notification?: boolean;
}

const RoundComplete: React.FC<RoundCompleteProps> = ({
    round,
    player1Move,
    player2Move,
    winner,
    p1Score,
    p2Score,
    betAmount,
    totalWinnings,
    notification = false
}) => {
    if (notification) {
        return (
            <div className="absolute bottom-6 right-6 z-50 animate-slide-in-out">
                <div className="bg-gradient-to-r from-green-900 to-blue-900 p-3 rounded-lg border border-green-600 shadow-xl min-w-[200px] max-w-xs">
                    <h3 className="text-base font-bold text-center mb-1 text-green-300">
                        🏆 Round {round} Complete!
                    </h3>
                    <div className="flex justify-between mb-1">
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Player 1</p>
                            <p className="text-sm font-bold text-blue-300">{player1Move}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Player 2</p>
                            <p className="text-sm font-bold text-green-300">{player2Move}</p>
                        </div>
                    </div>
                    <div className="text-center mb-1">
                        <p className="text-sm font-bold text-yellow-400">
                            {winner === 'Tie' ? 'It\'s a tie!' : `${winner} wins this round!`}
                        </p>
                    </div>
                    <div className="text-xs text-gray-300 text-center">
                        Score: <span className="text-blue-400">P1: {p1Score}</span> - <span className="text-green-400">P2: {p2Score}</span>
                    </div>
                </div>
            </div>
        );
    }
    // Default card style (fallback)
    return (
        <div className="bg-gradient-to-r from-green-900 to-blue-900 p-4 rounded-lg border border-green-600">
            <h3 className="text-lg font-bold text-center mb-3 text-green-300">
                🏆 Round {round} Complete!
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                    <p className="text-sm text-gray-400">Player 1</p>
                    <p className="text-lg font-bold text-blue-300">{player1Move}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Player 2</p>
                    <p className="text-lg font-bold text-green-300">{player2Move}</p>
                </div>
            </div>
            <div className="text-center mb-3">
                <p className="text-xl font-bold text-yellow-400">
                    {winner} wins this round!
                </p>
            </div>
            <div className="bg-gray-800 p-2 rounded text-center">
                <p className="text-sm text-gray-300">
                    Current Score: <span className="text-blue-400">Player 1: {p1Score}</span> - <span className="text-green-400">Player 2: {p2Score}</span>
                </p>
                <p className="text-sm text-gray-300 mt-1">
                    Bet amount: {betAmount} SOL
                </p>
                <p className="text-sm text-yellow-400 font-semibold">
                    🏆 Total Winnings: {totalWinnings} SOL
                </p>
            </div>
        </div>
    );
};

export default RoundComplete; 