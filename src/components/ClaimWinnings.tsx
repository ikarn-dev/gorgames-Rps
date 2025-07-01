import React from 'react';

interface ClaimWinningsProps {
    isWinner: boolean;
    isTie: boolean;
    isLoading: boolean;
    winningsClaimed: boolean;
    betAmount: number;
    handleClaimWinnings: () => void;
}

const ClaimWinnings: React.FC<ClaimWinningsProps> = ({ 
    isWinner, 
    isTie, 
    isLoading, 
    winningsClaimed, 
    betAmount,
    handleClaimWinnings 
}) => {
    if (isTie && !winningsClaimed) {
        return (
            <div className="mb-3">
                <button
                    onClick={handleClaimWinnings}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-md transition-colors"
                >
                    {isLoading ? 'Processing...' : '↩️ Claim Refund'}
                </button>
                <p className="text-xs text-gray-400 mt-1 text-center">
                    Game tied! Click to claim your refund of {betAmount} GOR
                </p>
            </div>
        );
    } else if (isWinner && !winningsClaimed) {
        return (
            <div className="mb-3">
                <button
                    onClick={handleClaimWinnings}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-bold rounded-md transition-colors"
                >
                    {isLoading ? 'Claiming...' : '🏆 Claim Winnings'}
                </button>
                <p className="text-xs text-gray-400 mt-1 text-center">
                    You won! Click to claim your winnings.
                </p>
            </div>
        );
    } else if (winningsClaimed) {
        return (
            <div className="mb-3 text-center">
                <p className="text-green-400 font-semibold">✅ {isTie ? 'Refund Claimed' : 'Winnings Claimed'}</p>
                <p className="text-xs text-gray-400">
                    {isTie ? 'Your refund has been processed.' : 'The winner has claimed their winnings.'}
                </p>
            </div>
        );
    }
    return null;
};

export default ClaimWinnings; 