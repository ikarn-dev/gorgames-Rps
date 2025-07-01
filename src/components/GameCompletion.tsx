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
}

export const GameCompletion: React.FC<GameCompletionProps> = ({
    gameJoinCode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameState,
    betAmount,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publicKey,
    handleClaimWinnings,
    winningsClaimed
}) => {
    // Only show completion message when game is actually completed and closed
    if (!gameJoinCode || !gameState || !gameState.status?.completed) return null;

    const p1Wins = gameState.rounds_won_p1 || 0;
    const p2Wins = gameState.rounds_won_p2 || 0;
    const isTie = p1Wins === p2Wins;
    const isPlayer1 = publicKey && gameState.player1 && gameState.player1.toString() === publicKey.toString();
    const isPlayer2 = publicKey && gameState.player2 && gameState.player2.toString() === publicKey.toString();
    const isWinner = (!isTie && ((isPlayer1 && p1Wins > p2Wins) || (isPlayer2 && p2Wins > p1Wins)));

    return (
        <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-gray-900 to-purple-900 border-2 border-purple-700/40 text-center">
            <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">3c6</span>
                <h2 className="text-2xl font-bold text-purple-300 mb-2">Game Completed</h2>
                {isTie ? (
                    <div className="text-yellow-300 font-semibold text-lg flex flex-col items-center">
                        <span className="text-3xl mb-1">91d</span>
                        Match ended in a <span className="underline">tie</span>!<br />
                        <span className="text-sm mt-1">Refund: <span className="font-mono">{betAmount} GOR</span></span>
                    </div>
                ) : isWinner && !winningsClaimed ? (
                    <>
                        <div className="text-green-400 font-bold text-lg flex flex-col items-center">
                            <span className="text-3xl mb-1">3c6</span>
                            Congratulations! You won!
                        </div>
                        <button
                            className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg shadow transition-colors text-lg"
                            onClick={handleClaimWinnings}
                        >
                            Claim Reward
                        </button>
                        <div className="text-sm text-gray-300 mt-2">Prize: <span className="font-mono">{betAmount * 2} GOR</span></div>
                    </>
                ) : isWinner && winningsClaimed ? (
                    <div className="text-green-300 font-semibold text-lg flex flex-col items-center">
                        <span className="text-3xl mb-1">389</span>
                        Winnings claimed!
                    </div>
                ) : (
                    <div className="text-red-300 font-semibold text-lg flex flex-col items-center">
                        <span className="text-3xl mb-1">622</span>
                        Better luck next time!
                    </div>
                )}
                <div className="mt-4 text-gray-400 text-sm">You can create a new game or join another one.</div>
            </div>
        </div>
    );
}; 