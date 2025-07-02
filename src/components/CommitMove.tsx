import React, { useState } from 'react';
import Image from 'next/image';
import GameConsole from './GameConsole';

interface CommitMoveProps {
    isLoading: boolean;
    handleCommitMove: (move: number) => void;
    disabled?: boolean;
    waitingMessage?: string;
}

const moveImages = [
    {
        name: 'Rock',
        src: '/assets/buttons/rock-button.png',
        color: 'from-amber-500 to-orange-600',
        hoverColor: 'from-amber-400 to-orange-500',
        shadow: 'shadow-amber-500/30'
    },
    {
        name: 'Paper',
        src: '/assets/buttons/paper-button.png',
        color: 'from-blue-500 to-indigo-600',
        hoverColor: 'from-blue-400 to-indigo-500',
        shadow: 'shadow-blue-500/30'
    },
    {
        name: 'Scissors',
        src: '/assets/buttons/scissor-button.png',
        color: 'from-red-500 to-pink-600',
        hoverColor: 'from-red-400 to-pink-500',
        shadow: 'shadow-red-500/30'
    },
];

const CommitMove: React.FC<CommitMoveProps> = ({ isLoading, handleCommitMove, disabled = false, waitingMessage }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleMoveClick = (index: number) => {
        if (isLoading || disabled) return;
        setSelectedIndex(index);
        // Add a brief delay for visual feedback
        setTimeout(() => {
            handleCommitMove(index);
            setSelectedIndex(null);
        }, 150);
    };

    // The move buttons and UI, extracted for reuse
    const moveButtonsUI = (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-2 bg-transparent">
            {/* Header */}
            <div className="relative z-10 text-center mb-2">
                <h3 className="text-base font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-1">
                    Choose Your Weapon
                </h3>
                <p className="text-gray-400 text-xs">Select your move to battle!</p>
                {waitingMessage && (
                    <div className="mt-2 text-xs text-yellow-300 font-semibold animate-pulse">{waitingMessage}</div>
                )}
            </div>

            {/* Buttons container */}
            <div className="flex gap-3 justify-center items-center px-2 py-2">
                {moveImages.map((move, index) => (
                    <button
                        key={move.name}
                        onClick={() => handleMoveClick(index)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        disabled={isLoading || disabled}
                        className={`
                            group relative flex flex-col items-center justify-center min-w-[56px] md:min-w-[70px]
                            focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-300 ease-out transform
                            ${hoveredIndex === index ? 'scale-110 -translate-y-1' : 'scale-100'}
                            ${selectedIndex === index ? 'scale-95' : ''}
                        `}
                    >
                        {/* Glow effect */}
                        <div className={`
                            absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 
                            transition-opacity duration-300 ${move.shadow}
                            ${hoveredIndex === index ? 'animate-pulse' : ''}
                        `} />
                        {/* Main button container */}
                        <div className={`
                            relative w-12 h-12 md:w-14 md:h-14 rounded-full p-1 shadow-xl transition-all duration-300
                            bg-gradient-to-br ${hoveredIndex === index ? move.hoverColor : move.color}
                            border-2 ${hoveredIndex === index ? 'border-white/30' : 'border-white/10'}
                            ${selectedIndex === index ? 'ring-2 ring-white/50' : ''}
                        `}>
                            {/* Inner circle */}
                            <div className="w-full h-full rounded-full bg-gray-900/80 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                                {/* Shimmer effect */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                    transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]
                                    transition-transform duration-700 ease-out
                                `} />
                                {/* Image */}
                                <Image
                                    src={move.src}
                                    alt={move.name}
                                    width={24}
                                    height={24}
                                    className="w-6 h-6 md:w-7 md:h-7 object-contain select-none pointer-events-none relative z-10"
                                    draggable={false}
                                />
                            </div>
                        </div>
                        {/* Enhanced name label */}
                        <div className={`
                            mt-1 px-2 py-0.5 bg-gray-700 rounded-md shadow-md transition-all duration-150 group-hover:bg-purple-600 inline-flex
                            ${hoveredIndex === index 
                                ? `bg-gradient-to-r ${move.color} text-white shadow-xl` 
                                : 'bg-gray-800/80 text-gray-300 border border-gray-600/50'
                            }
                            backdrop-blur-sm
                        `}>
                            <span className="font-bold text-xs select-none pointer-events-none tracking-wide">
                                {move.name}
                            </span>
                        </div>
                        {/* Hover particles effect */}
                        {hoveredIndex === index && (
                            <div className="absolute inset-0 pointer-events-none">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`
                                            absolute w-1 h-1 rounded-full animate-ping
                                            bg-gradient-to-r ${move.color}
                                        `}
                                        style={{
                                            left: `${20 + Math.random() * 60}%`,
                                            top: `${20 + Math.random() * 60}%`,
                                            animationDelay: `${i * 0.1}s`,
                                            animationDuration: '1s'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </button>
                ))}
            </div>
            {/* Loading state overlay */}
            {isLoading && !disabled && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-white">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Show GameConsole only on md+ screens */}
            <div className="hidden md:block w-full">
                <GameConsole>
                    {moveButtonsUI}
                </GameConsole>
            </div>
            {/* Show only move buttons on small screens, inside a vibrant purple gradient card */}
            <div className="block md:hidden w-full">
                <div className="max-w-xs mx-auto p-2 rounded-2xl shadow-lg border border-purple-500/60 bg-white dark:bg-neutral-900 flex flex-col justify-center items-center min-h-[220px] relative overflow-hidden animate-fade-in"
                    style={{ boxShadow: '0 2px 12px 0 #7c3aed22' }}>
                    <div className="w-full flex flex-col items-center justify-center">
                        {moveButtonsUI}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommitMove;