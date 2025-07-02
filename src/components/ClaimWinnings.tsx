import React from 'react';

interface ClaimWinningsProps {
    isWinner: boolean;
    isTie: boolean;
    isLoading: boolean;
    winningsClaimed: boolean;
    betAmount: number;
    handleClaimWinnings: () => void;
}

const Spinner = () => (
    <svg className="animate-spin h-5 w-5 mr-2 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

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
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-md transition-colors flex items-center justify-center"
                >
                    {isLoading && <Spinner />}
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
                    className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white font-bold rounded-md transition-colors flex items-center justify-center"
                >
                    {isLoading && <Spinner />}
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