import React from 'react';

interface TurnIndicatorProps {
    hasCommitted: boolean;
    opponentCommitted: boolean;
    bothCommitted: boolean;
    movesRevealed: boolean;
    player1Commit: boolean;
    player2Commit: boolean;
    isYou1: boolean;
    isYou2: boolean;
}

const TurnIndicator: React.FC<TurnIndicatorProps> = ({
    hasCommitted,
    opponentCommitted,
    bothCommitted,
    movesRevealed,
    player1Commit,
    player2Commit,
    isYou1,
    isYou2
}) => (
    <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-2xl border-2 border-blue-700/40 shadow-lg">
        <h3 className="text-xl font-bold text-center mb-3 text-blue-300">
            🎯 Current Turn
        </h3>
        {movesRevealed ? (
            <div className="text-center">
                <p className="text-yellow-400 font-semibold text-lg">Round Complete!</p>
                <p className="text-sm text-gray-300">Waiting for next round...</p>
            </div>
        ) : bothCommitted ? (
            <div className="text-center">
                <p className="text-purple-400 font-semibold text-lg">🔄 Auto-Revealing Moves</p>
                <p className="text-sm text-gray-300">Both players have committed their moves</p>
            </div>
        ) : hasCommitted ? (
            <div className="text-center">
                <p className="text-green-400 font-semibold text-lg">✅ Your Move is Committed</p>
                <p className="text-sm text-gray-300">Waiting for opponent to make their move...</p>
            </div>
        ) : opponentCommitted ? (
            <div className="text-center">
                <p className="text-orange-400 font-semibold text-lg">⏰ Your Turn!</p>
                <p className="text-sm text-gray-300">Opponent has made their move. Select your move below.</p>
            </div>
        ) : (
            <div className="text-center">
                <p className="text-blue-400 font-semibold text-lg">🎮 Ready to Play</p>
                <p className="text-sm text-gray-300">Both players can make their moves</p>
            </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
                <p className={`font-semibold ${player1Commit ? 'text-green-400' : 'text-yellow-400'} text-base`}>
                    Player 1 {player1Commit ? '✅' : '⏳'} {isYou1 && <span className="text-xs">(You)</span>}
                </p>
            </div>
            <div className="text-center">
                <p className={`font-semibold ${player2Commit ? 'text-green-400' : 'text-yellow-400'} text-base`}>
                    Player 2 {player2Commit ? '✅' : '⏳'} {isYou2 && <span className="text-xs">(You)</span>}
                </p>
            </div>
        </div>
    </div>
);

export default TurnIndicator; 