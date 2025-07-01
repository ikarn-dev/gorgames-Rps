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
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-lg border border-blue-600">
        <h3 className="text-lg font-bold text-center mb-2 text-blue-300">
            🎯 Current Turn
        </h3>
        {movesRevealed ? (
            <div className="text-center">
                <p className="text-yellow-400 font-semibold">Round Complete!</p>
                <p className="text-sm text-gray-300">Waiting for next round...</p>
            </div>
        ) : bothCommitted ? (
            <div className="text-center">
                <p className="text-purple-400 font-semibold">🔄 Auto-Revealing Moves</p>
                <p className="text-sm text-gray-300">Both players have committed their moves</p>
            </div>
        ) : hasCommitted ? (
            <div className="text-center">
                <p className="text-green-400 font-semibold">✅ Your Move is Committed</p>
                <p className="text-sm text-gray-300">Waiting for opponent to make their move...</p>
            </div>
        ) : opponentCommitted ? (
            <div className="text-center">
                <p className="text-orange-400 font-semibold">⏰ Your Turn!</p>
                <p className="text-sm text-gray-300">Opponent has made their move. Select your move below.</p>
            </div>
        ) : (
            <div className="text-center">
                <p className="text-blue-400 font-semibold">🎮 Ready to Play</p>
                <p className="text-sm text-gray-300">Both players can make their moves</p>
            </div>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
                <p className={`font-semibold ${player1Commit ? 'text-green-400' : 'text-yellow-400'}`}>Player 1 {player1Commit ? '✅' : '⏳'}</p>
                <p className="text-gray-400">{isYou1 ? '(You)' : ''}</p>
            </div>
            <div className="text-center">
                <p className={`font-semibold ${player2Commit ? 'text-green-400' : 'text-yellow-400'}`}>Player 2 {player2Commit ? '✅' : '⏳'}</p>
                <p className="text-gray-400">{isYou2 ? '(You)' : ''}</p>
            </div>
        </div>
    </div>
);

export default TurnIndicator; 