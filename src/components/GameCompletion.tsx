import React from 'react';

interface GameCompletionProps {
    gameJoinCode: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameState: any;
    betAmount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publicKey?: any;
    handleClaimWinnings?: () => void;
    winningsClaimed?: boolean;
    handleExitRoom?: () => void;
}

export const GameCompletion: React.FC<GameCompletionProps> = ({
    gameJoinCode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameState,
    betAmount,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publicKey,
    handleClaimWinnings,
    winningsClaimed,
    handleExitRoom
}) => {
    // Only show completion message when game is actually completed and closed
    if (!gameJoinCode || !gameState || !gameState.status?.completed) return null;

    const p1Wins = gameState.rounds_won_p1 || 0;
    const p2Wins = gameState.rounds_won_p2 || 0;
    const isTie = p1Wins === p2Wins;
    const isPlayer1 = publicKey && gameState.player1 && gameState.player1.toString() === publicKey.toString();
    const isPlayer2 = publicKey && gameState.player2 && gameState.player2.toString() === publicKey.toString();
    const isWinner = (!isTie && ((isPlayer1 && p1Wins > p2Wins) || (isPlayer2 && p2Wins > p1Wins)));
    const isLoser = !isTie && !isWinner;

    return (
        <div className="p-4 sm:p-6 rounded-xl shadow-lg border border-purple-700/40 text-center max-w-xs mx-auto">
            <div className="flex flex-col items-center gap-2">
                {(!isLoser || isTie) && <span className="text-3xl sm:text-4xl">🏆</span>}
                <h2 className="text-lg sm:text-2xl font-bold text-purple-300 mb-2">Game Completed</h2>
                {isTie ? (
                    <div className="text-yellow-300 font-semibold text-base sm:text-lg flex flex-col items-center">
                        <span className="text-2xl sm:text-3xl mb-1">🤝</span>
                        It&apos;s a <span className="underline">tie</span>!<br />
                        <span className="text-xs sm:text-sm mt-1">Refund: <span className="font-mono">{betAmount} GOR</span></span>
                    </div>
                ) : isWinner && !winningsClaimed ? (
                    <>
                        <div className="text-green-400 font-bold text-base sm:text-lg flex flex-col items-center">
                            <span className="text-2xl sm:text-3xl mb-1">🎉</span>
                            Congratulations! You won!
                        </div>
                        <button
                            className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg shadow transition-colors text-base sm:text-lg"
                            onClick={handleClaimWinnings}
                        >
                            Claim Reward
                        </button>
                        <div className="text-xs sm:text-sm text-gray-300 mt-2">Prize: <span className="font-mono">{betAmount * 2} GOR</span></div>
                    </>
                ) : isWinner && winningsClaimed ? (
                    <div className="text-green-300 font-semibold text-base sm:text-lg flex flex-col items-center">
                        <span className="text-2xl sm:text-3xl mb-1">💰</span>
                        Winnings claimed!
                    </div>
                ) : (
                    <>
                        <div className="text-red-300 font-semibold text-base sm:text-lg flex flex-col items-center">
                            <span className="text-2xl sm:text-3xl mb-1">😔</span>
                            You lost this match.<br />
                            <span className="text-xs sm:text-sm mt-1">Better luck next time!</span>
                        </div>
                        <button
                            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg shadow border border-purple-400 transition-colors text-base sm:text-lg"
                            onClick={handleExitRoom}
                        >
                            Leave Room
                        </button>
                        <div className="mt-2 text-gray-400 text-xs sm:text-sm">You can leave the room now and create or join a new room.</div>
                    </>
                )}
            </div>
        </div>
    );
}; 