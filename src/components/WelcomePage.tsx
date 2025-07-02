"use client";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Gradient Overlay for Enhanced Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{background: 'linear-gradient(120deg, #6d28d9 0%, #a21caf 40%, #22d3ee 100%)', opacity: 0.18}} />

      {/* Retro 90s Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `
                 linear-gradient(45deg, #00ffff 25%, transparent 25%), 
                 linear-gradient(-45deg, #00ffff 25%, transparent 25%), 
                 linear-gradient(45deg, transparent 75%, #00ffff 75%), 
                 linear-gradient(-45deg, transparent 75%, #00ffff 75%)
               `,
               backgroundSize: '40px 40px',
               backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
             }}>
        </div>
      </div>

      {/* Animated Grid Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }}>
        </div>
      </div>

      {/* Connect Wallet Button - Top Right (Hidden on small screens) */}
      <div className="absolute top-4 right-4 z-20 hidden md:block">
        <div className="transform hover:scale-105 transition-transform duration-200">
          <WalletMultiButton className="!bg-cyan-400 hover:!bg-cyan-300 !text-black !font-bold !text-sm !px-6 !py-3 !rounded-lg !border-2 !border-cyan-300 !shadow-lg !shadow-cyan-400/50 !transition-all !duration-200" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 pb-20 lg:pb-16">
        {/* Header */}
        <div className="text-center mb-3 lg:mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-2 lg:mb-2 drop-shadow-lg bg-gradient-to-r from-purple-400 via-fuchsia-500 to-green-400 bg-clip-text text-transparent" 
              style={{
                fontFamily: 'var(--font-orbitron), "Courier New", monospace',
                letterSpacing: '0.2em'
              }}>
            GORBAGANA
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            ROCK PAPER SCISSORS
          </h2>
          <div className="w-16 md:w-20 lg:w-20 xl:w-24 h-1 bg-cyan-400 mx-auto rounded-full"></div>
        </div>

        {/* Game Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-3 max-w-4xl lg:max-w-4xl xl:max-w-5xl w-full mb-3 lg:mb-4">
          {/* Left Card - Game Features */}
          <div className="bg-neutral-900/80 backdrop-blur-md rounded-lg p-3 lg:p-3 border-2 border-cyan-400 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-300 hover:cursor-pointer">
            <h3 className="text-lg lg:text-lg font-bold text-cyan-400 mb-2 lg:mb-2 text-center">🎮 GAME FEATURES</h3>
            <div className="space-y-1 lg:space-y-1 text-white/90 text-xs lg:text-xs">
              <div className="flex items-center gap-2 hover:text-cyan-300 transition-colors hover:cursor-pointer">
                <span className="text-cyan-400">▶</span>
                <span>Connect your Solana wallet to start</span>
              </div>
              <div className="flex items-center gap-2 hover:text-pink-300 transition-colors hover:cursor-pointer">
                <span className="text-pink-400">▶</span>
                <span>Create a game room with custom bet amount</span>
              </div>
              <div className="flex items-center gap-2 hover:text-yellow-300 transition-colors hover:cursor-pointer">
                <span className="text-yellow-400">▶</span>
                <span>Share your room code with friends</span>
              </div>
              <div className="flex items-center gap-2 hover:text-green-300 transition-colors hover:cursor-pointer">
                <span className="text-green-400">▶</span>
                <span>Best of 3 rounds</span>
              </div>
              <div className="flex items-center gap-2 hover:text-purple-300 transition-colors hover:cursor-pointer">
                <span className="text-purple-400">▶</span>
                <span>Winner takes the entire pot!</span>
              </div>
            </div>
          </div>

          {/* Right Card - How to Play */}
          <div className="bg-neutral-900/80 backdrop-blur-md rounded-lg p-3 lg:p-3 border-2 border-pink-400 shadow-lg shadow-pink-400/30 hover:shadow-pink-400/50 transition-all duration-300 hover:cursor-pointer">
            <h3 className="text-lg lg:text-lg font-bold text-pink-400 mb-2 lg:mb-2 text-center">🎯 HOW TO PLAY</h3>
            <div className="space-y-1 lg:space-y-1 text-white/90 text-xs lg:text-xs">
              <div className="flex items-center gap-2 hover:text-cyan-300 transition-colors hover:cursor-pointer">
                <span className="bg-cyan-400 text-black px-2 py-1 rounded text-xs font-bold">1</span>
                <span>Connect your wallet</span>
              </div>
              <div className="flex items-center gap-2 hover:text-pink-300 transition-colors hover:cursor-pointer">
                <span className="bg-pink-400 text-black px-2 py-1 rounded text-xs font-bold">2</span>
                <span>Create a game or join with room code</span>
              </div>
              <div className="flex items-center gap-2 hover:text-yellow-300 transition-colors hover:cursor-pointer">
                <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">3</span>
                <span>Choose your move: Rock, Paper, or Scissors</span>
              </div>
              <div className="flex items-center gap-2 hover:text-green-300 transition-colors hover:cursor-pointer">
                <span className="bg-green-400 text-black px-2 py-1 rounded text-xs font-bold">4</span>
                <span>Wait for your opponent</span>
              </div>
              <div className="flex items-center gap-2 hover:text-purple-300 transition-colors hover:cursor-pointer">
                <span className="bg-purple-400 text-black px-2 py-1 rounded text-xs font-bold">5</span>
                <span>Win 2 rounds to claim the prize!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-neutral-900/80 backdrop-blur-md rounded-lg p-3 lg:p-3 border-2 border-yellow-400 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-all duration-300 max-w-3xl lg:max-w-3xl xl:max-w-4xl w-full mb-3 lg:mb-4 hover:cursor-pointer">
          <h3 className="text-lg lg:text-lg font-bold text-yellow-400 mb-2 lg:mb-2 text-center">🔒 SECURE & FAIR PLAY</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-2 text-center text-white/90">
            <div className="space-y-1 hover:scale-105 transition-transform duration-200">
              <div className="text-xl lg:text-xl">🔐</div>
              <div className="text-xs">Moves are committed and revealed on-chain</div>
            </div>
            <div className="space-y-1 hover:scale-105 transition-transform duration-200">
              <div className="text-xl lg:text-xl">⚖️</div>
              <div className="text-xs">Smart contract ensures fair gameplay</div>
            </div>
            <div className="space-y-1 hover:scale-105 transition-transform duration-200">
              <div className="text-xl lg:text-xl">💰</div>
              <div className="text-xs">Automatic prize distribution</div>
            </div>
          </div>
        </div>

        {/* Ready to Play Section with Wallet Button for Mobile */}
        <div className="text-center">
          <div className="bg-neutral-900/80 backdrop-blur-md rounded-lg p-3 lg:p-3 border-2 border-green-400 shadow-lg shadow-green-400/30 hover:shadow-green-400/50 transition-all duration-300 inline-block hover:cursor-pointer">
            <h3 className="text-base lg:text-base font-bold text-green-400 mb-2">🚀 READY TO PLAY?</h3>
            <p className="text-white/80 text-xs lg:text-xs mb-3">Connect your wallet to start playing!</p>
            {/* Mobile Wallet Button */}
            <div className="md:hidden transform hover:scale-105 transition-transform duration-200">
              <WalletMultiButton className="!bg-cyan-400 hover:!bg-cyan-300 !text-black !font-bold !text-sm !px-6 !py-3 !rounded-lg !border-2 !border-cyan-300 !shadow-lg !shadow-cyan-400/50 !transition-all !duration-200" />
            </div>
          </div>
        </div>

        {/* Retro Decorative Elements */}
        <div className="absolute top-4 left-4 text-cyan-400 text-xl">◢</div>
        <div className="absolute top-4 right-20 text-pink-400 text-xl hidden md:block">◣</div>
        <div className="absolute bottom-4 left-4 text-yellow-400 text-xl">◤</div>
        <div className="absolute bottom-4 right-4 text-green-400 text-xl">◥</div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-2 lg:p-3 bg-neutral-900/80 backdrop-blur-md">
        <div className="text-center space-y-1 lg:space-y-1">
          {/* Testnet Note */}
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-lg p-1 lg:p-2 border border-yellow-500/50 max-w-sm lg:max-w-md mx-auto">
            <p className="text-yellow-300/80 text-xs">This is a testnet application. Use testnet $GOR only.</p>
          </div>
          
          {/* Creator Credit */}
          <div className="text-white/70 text-xs lg:text-sm">
            <span>Created by </span>
            <span className="text-cyan-400 font-bold">Karan</span>
            <span className="mx-2">•</span>
            <a 
              href="https://x.com/iKK6600" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors font-bold"
            >
              @iKK6600
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 