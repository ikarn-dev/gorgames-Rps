import React from 'react';

interface GameConsoleProps {
  children: React.ReactNode;
}

const GameConsole: React.FC<GameConsoleProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center w-full h-full py-2 sm:py-4">
      <style>{`
        @media (max-width: 640px) {
          .game-console-body {
            width: 98vw !important;
            height: auto !important;
            min-width: 0 !important;
            min-height: 0 !important;
            max-width: 98vw !important;
            max-height: none !important;
          }
          .game-console-inner {
            width: 92vw !important;
            height: auto !important;
            min-width: 0 !important;
            min-height: 0 !important;
            max-width: 92vw !important;
            max-height: none !important;
          }
          .game-console-screen {
            width: 85vw !important;
            height: auto !important;
            min-width: 0 !important;
            min-height: 0 !important;
            max-width: 85vw !important;
            max-height: none !important;
            margin-top: 2vw !important;
          }
          .game-console-joystick {
            width: 16vw !important;
            height: 48vw !important;
            min-width: 24px !important;
            min-height: 48px !important;
            max-width: 40px !important;
            max-height: 80px !important;
          }
        }
      `}</style>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
        {/* Joystick A */}
        <div className="game-console-joystick flex flex-col items-start bg-[#4655f5] rounded-l-[2.5vw] rounded-r-[0.25vw] border-l-[0.5vw] border-t-[0.5vw] border-b-[0.5vw] border-[#000] border-r-[#3340c4] shadow-lg w-[6vw] h-[20vw] min-w-[24px] min-h-[48px] max-w-[80px] max-h-[260px] relative">
          <div className="bg-[#111] w-[1vw] h-[0.3vw] mt-[2vw] ml-[4vw] rounded cursor-pointer" />
          <div className="bg-[#111] rounded-full w-[2.7vw] h-[2.7vw] mt-[1.5vw] ml-[1.5vw] border-[0.15vw] border-black cursor-pointer" />
          {/* D-pad */}
          <div className="flex flex-col items-center w-[6vw] mt-[0.5vw]">
            <div className="flex flex-col items-center">
              <div className="bg-[#111] border border-black rounded-full w-[1.3vw] h-[1.3vw] flex items-center justify-center text-xs font-bold text-gray-200 cursor-pointer mb-1">
                <div className="border-b-[0.5vw] border-x-[0.5vw] border-t-0 border-transparent border-b-black w-0 h-0" />
              </div>
              <div className="flex flex-row justify-between w-full">
                <div className="bg-[#111] border border-black rounded-full w-[1.3vw] h-[1.3vw] flex items-center justify-center text-xs font-bold text-gray-200 cursor-pointer mr-[1.5vw]">
                  <div className="border-b-[0.5vw] border-x-[0.5vw] border-t-0 border-transparent border-b-black w-0 h-0 rotate-[-90deg]" />
                </div>
                <div className="bg-[#111] border border-black rounded-full w-[1.3vw] h-[1.3vw] flex items-center justify-center text-xs font-bold text-gray-200 cursor-pointer ml-[1.5vw]">
                  <div className="border-b-[0.5vw] border-x-[0.5vw] border-t-0 border-transparent border-b-black w-0 h-0 rotate-[90deg]" />
                </div>
              </div>
              <div className="bg-[#111] border border-black rounded-full w-[1.3vw] h-[1.3vw] flex items-center justify-center text-xs font-bold text-gray-200 cursor-pointer mt-1">
                <div className="border-b-[0.5vw] border-x-[0.5vw] border-t-0 border-transparent border-b-black w-0 h-0 rotate-180" />
              </div>
            </div>
          </div>
          <div className="bg-[#111] w-[1.3vw] h-[1.3vw] rounded-[10%] flex items-center justify-center border-[0.15vw] border-black mt-[0.5vw] ml-[3.5vw] cursor-pointer">
            <div className="bg-black rounded-full w-[1vw] h-[1vw]" />
          </div>
        </div>
        {/* Console body */}
        <div className="flex flex-col items-center">
          <div className="game-console-body bg-black w-[40vw] h-[21vw] min-w-[120px] min-h-[60px] max-w-[500px] max-h-[260px] flex flex-col items-center justify-center rounded-lg relative">
            <div className="bg-black w-[3vw] h-[0.3vw] mt-[1vw] rounded-t cursor-pointer absolute left-[-3vw] top-0" />
            <div className="game-console-inner bg-[#111] w-[37vw] h-[19vw] min-w-[100px] min-h-[40px] max-w-[460px] max-h-[220px] rounded-lg flex flex-col items-center justify-center relative">
              {/* Screen area for children */}
              <div className="game-console-screen bg-[#202020] w-[33vw] h-[16vw] min-w-[80px] min-h-[32px] max-w-[400px] max-h-[180px] rounded-lg mt-[1.5vw] flex items-center justify-center overflow-hidden">
                {children}
              </div>
              <div className="flex flex-row justify-between w-full px-2 md:px-4 mt-auto mb-2">
                <div className="bg-black w-[2vw] h-[0.3vw] rounded-t" />
                <div className="bg-black w-[2vw] h-[0.3vw] rounded-t" />
              </div>
            </div>
          </div>
        </div>
        {/* Joystick B */}
        <div className="game-console-joystick flex flex-col items-end bg-[#e10f00] rounded-r-[2.5vw] rounded-l-[0.25vw] border-r-[0.5vw] border-t-[0.5vw] border-b-[0.5vw] border-[#000] border-l-[#e8291c] shadow-lg w-[6vw] h-[20vw] min-w-[24px] min-h-[48px] max-w-[80px] max-h-[260px] relative">
          <div className="relative w-[2vw] h-[2vw] mt-[2vw] mr-[2vw] cursor-pointer">
            <div className="absolute bg-[#111] w-[12%] h-[50%] top-[0.75vw] left-[0.9vw] rotate-0" />
            <div className="absolute bg-[#111] w-[12%] h-[50%] top-[0.75vw] left-[0.9vw] rotate-90" />
          </div>
          <div className="flex flex-col items-center w-[6vw] mt-[0.5vw]">
            <div className="bg-[#111] border border-black rounded-full w-[1.3vw] h-[1.3vw] flex items-center justify-center text-xs font-bold text-gray-200 cursor-pointer mb-1">X</div>
            <div className="flex flex-row justify-between w-full">
              <div className="bg-[#111] border border-black rounded-full w-[1.3vw] h-[1.3vw] flex items-center justify-center text-xs font-bold text-gray-200 cursor-pointer mr-[1.5vw]">Y</div>
              <div className="bg-[#111] border border-black rounded-full w-[1.3vw] h-[1.3vw] flex items-center justify-center text-xs font-bold text-gray-200 cursor-pointer ml-[1.5vw]">A</div>
            </div>
            <div className="bg-[#111] border border-black rounded-full w-[1.3vw] h-[1.3vw] flex items-center justify-center text-xs font-bold text-gray-200 cursor-pointer mt-1">B</div>
          </div>
          <div className="bg-[#111] rounded-full w-[2.7vw] h-[2.7vw] mt-[1.5vw] mr-[1.5vw] border-[0.15vw] border-black cursor-pointer" />
          <div className="bg-[#111] border-[0.2vw] border-[#ed3528] rounded-full w-[1.3vw] h-[1.3vw] mt-[0.5vw] mr-[1vw] flex items-center justify-center cursor-pointer">
            <div className="flex flex-col items-center mt-[0.1vw]">
              <div className="border-b-[0.5vw] border-x-[0.5vw] border-t-0 border-transparent border-b-black w-0 h-0" />
              <div className="bg-black w-[0.6vw] h-[0.3vw] flex items-center justify-center">
                <div className="bg-[#111] w-[0.2vw] h-[0.2vw]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameConsole; 