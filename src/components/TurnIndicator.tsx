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

const statusDisplay = (
    movesRevealed: boolean,
    bothCommitted: boolean,
    hasCommitted: boolean,
    opponentCommitted: boolean
) => {
    if (movesRevealed) {
        return {
            icon: '🏁',
            color: 'text-yellow-400',
            title: 'Round Complete!',
            desc: 'Waiting for next round...'
        };
    } else if (bothCommitted) {
        return {
            icon: '🔄',
            color: 'text-purple-400',
            title: 'Auto-Revealing',
            desc: 'Both players have committed their moves.'
        };
    } else if (hasCommitted) {
        return {
            icon: '✅',
            color: 'text-green-400',
            title: 'Move Committed',
            desc: 'Waiting for opponent...'
        };
    } else if (opponentCommitted) {
        return {
            icon: '⏰',
            color: 'text-orange-400',
            title: 'Your Turn!',
            desc: 'Opponent has made their move.'
        };
    } else {
        return null; // Don't show status for 'Ready to Play'
    }
};

const TurnIndicator: React.FC<TurnIndicatorProps> = ({
    hasCommitted,
    opponentCommitted,
    bothCommitted,
    movesRevealed,
    player1Commit,
    player2Commit,
    isYou1,
    isYou2
}) => {
    const status = statusDisplay(movesRevealed, bothCommitted, hasCommitted, opponentCommitted);
    return (
        <div className="bg-gradient-to-br from-purple-800 to-[#181c2f] border border-purple-700 rounded-lg p-2 shadow flex flex-col items-center max-w-xs mx-auto">
            {/* Title */}
            <div className="flex items-center justify-center gap-2 mb-1 relative z-10">
                <span className="text-xs sm:text-sm font-extrabold text-purple-300" style={{fontFamily: 'var(--font-orbitron), "Courier New", monospace'}}>
                    🎯 Current Turn
                </span>
            </div>
            {/* Status (not shown for 'Ready to Play') */}
            {status && (
                <div className="flex flex-col items-center mb-1">
                    <span className={`text-xl sm:text-2xl font-bold ${status.color}`}>{status.icon}</span>
                    <span className={`mt-1 text-xs sm:text-sm font-bold ${status.color}`}>{status.title}</span>
                    <span className="text-[10px] sm:text-xs text-gray-300 mt-0.5 text-center">{status.desc}</span>
                </div>
            )}
            {/* Player Status Bar */}
            <div className="flex flex-row justify-between items-center gap-1 bg-gray-900 border border-gray-700 rounded px-1 py-1 w-full">
                {/* Player 1 */}
                <div className="flex flex-col items-center flex-1">
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-blue-300">P1</span>
                        {isYou1 && <span className="ml-1 px-1 py-0.5 bg-yellow-400 text-black text-[10px] font-bold rounded-full">You</span>}
                    </div>
                    <span className={`mt-0.5 text-base ${player1Commit ? 'text-green-400' : 'text-yellow-400'} animate-pulse`}>{player1Commit ? '✅' : '⏳'}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{player1Commit ? 'Committed' : 'Waiting'}</span>
                </div>
                {/* VS Divider */}
                <div className="flex flex-col items-center mx-1">
                    <span className="text-xs font-extrabold text-purple-400">VS</span>
                </div>
                {/* Player 2 */}
                <div className="flex flex-col items-center flex-1">
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-pink-300">P2</span>
                        {isYou2 && <span className="ml-1 px-1 py-0.5 bg-yellow-400 text-black text-[10px] font-bold rounded-full">You</span>}
                    </div>
                    <span className={`mt-0.5 text-base ${player2Commit ? 'text-green-400' : 'text-yellow-400'} animate-pulse`}>{player2Commit ? '✅' : '⏳'}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{player2Commit ? 'Committed' : 'Waiting'}</span>
                </div>
            </div>
        </div>
    );
};

export default TurnIndicator; 