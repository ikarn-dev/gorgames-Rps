import React from 'react';

interface GameCompletionProps {
    gameJoinCode: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameState: any;
    gameError: string | null;
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
    gameError,
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
        <div className="p-4 border border-gray-600 rounded-lg">
            <div className="p-3 bg-blue-900 text-blue-200 rounded-md text-sm border border-blue-700">
                <p className="font-semibold">Game Completed</p>
                <p>This game has been completed and closed.</p>
                {isTie ? (
                    <p className="mt-2 text-yellow-300">
                        Game ended in a tie - Refund amount: {betAmount} SOL
                    </p>
                ) : isWinner && !winningsClaimed ? (
                    <button
                        className="mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded transition-colors"
                        onClick={handleClaimWinnings}
                    >
                        Claim Reward
                    </button>
                ) : isWinner && winningsClaimed ? (
                    <p className="mt-2 text-green-300 font-semibold">Winnings claimed!</p>
                ) : null}
                <p className="mt-2">You can create a new game or join another one.</p>
            </div>
        </div>
    );
}; 