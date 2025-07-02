import React, { useEffect, useState } from 'react';

interface CreateGameProps {
    joinCode: string;
    setJoinCode: (code: string) => void;
    betAmount: string;
    setBetAmount: (amount: string) => void;
    isLoading: boolean;
    isCreating: boolean;
    isJoining: boolean;
    handleInitializeGame: () => void;
    handleJoinGame: () => void;
    roomReady: boolean;
    walletReady: boolean;
}

const badgeEmojis = ['✊', '✋', '✌️'];

const CreateGame: React.FC<CreateGameProps> = ({
    joinCode,
    setJoinCode,
    isLoading,
    isCreating,
    isJoining,
    handleInitializeGame,
    handleJoinGame,
    walletReady
}) => {
    const [emojiIndex, setEmojiIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setEmojiIndex((prev) => (prev + 1) % badgeEmojis.length);
                setFade(true);
            }, 200); // fade out duration
        }, 900);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-5 sm:p-6 rounded-2xl shadow-2xl bg-gray-900 border-2 border-purple-700/60 max-w-md mx-auto flex flex-col gap-4 relative overflow-visible pt-14"
            style={{ boxShadow: '0 0 24px 2px #a78bfa55, 0 2px 16px 0 #0008' }}>
            {/* Animated Icon */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-4 border-gray-900 z-10">
                <span
                    className={`text-3xl transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Rock Paper Scissors Emoji"
                    style={{lineHeight: 1}}
                >
                    {badgeEmojis[emojiIndex]}
                </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold mt-8 mb-2 text-purple-200 text-center tracking-wide" style={{fontFamily: 'var(--font-orbitron), "Courier New", monospace'}}>
                Create or Join a Game Room
            </h2>
            <p className="text-xs text-center text-gray-400 mb-2">Room ID must be 8 characters or less. Bet is fixed for this testnet.</p>
            <div className="space-y-4">
                <div className="flex flex-col gap-3">
                    <label className="text-sm text-gray-300 font-semibold mb-1" htmlFor="room-id">Room ID</label>
                    <input
                        id="room-id"
                        type="text"
                        placeholder="Enter Room ID (max 8 chars)"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        className="flex-1 bg-gray-800 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-lg font-mono border border-purple-700/40 shadow-inner placeholder-gray-500"
                        disabled={isLoading}
                        maxLength={8}
                    />
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-cyan-300 text-xs sm:text-sm font-bold tracking-wider" style={{ fontFamily: 'var(--font-orbitron), \'Courier New\', monospace' }}>Bet Amount:</span>
                        <span className="bg-purple-700 text-white px-3 py-1 rounded-lg font-extrabold text-base sm:text-lg shadow border border-purple-500/40 tracking-widest" style={{ fontFamily: 'var(--font-orbitron), \'Courier New\', monospace' }}>
                          0.05 GOR
                        </span>
                        <div className="relative group flex items-center">
                          <button type="button" tabIndex={0} aria-label="Bet info" className="ml-1 text-xs text-cyan-300 hover:text-cyan-400 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                            </svg>
                          </button>
                          <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 w-52 px-3 py-2 rounded-lg bg-neutral-900 text-cyan-200 text-xs shadow-lg border border-cyan-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-200 whitespace-normal" style={{ fontFamily: 'var(--font-orbitron), \'Courier New\', monospace' }}>
                            Custom bet amounts and higher stakes coming soon!
                          </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                        onClick={handleInitializeGame}
                        disabled={isCreating || isJoining || !walletReady}
                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-all text-lg shadow-lg border-2 border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        {isCreating ? 'Creating...' : 'Create Game'}
                    </button>
                    <button
                        onClick={handleJoinGame}
                        disabled={isCreating || isJoining || !walletReady}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-extrabold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-all text-lg shadow-lg border-2 border-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        {isJoining ? 'Joining...' : 'Join Game'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGame; 