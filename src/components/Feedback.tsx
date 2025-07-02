import React from 'react';

interface FeedbackProps {
    feedback: { type: 'success' | 'error' | 'info' | 'warning'; message: string } | null;
    onClose?: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ feedback, onClose }) => {
    if (!feedback) return null;

    const getFeedbackStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-cyan-950 text-cyan-200 border-cyan-400';
            case 'info':
                return 'bg-cyan-950 text-cyan-200 border-cyan-400';
            case 'error':
                return 'bg-pink-950 text-pink-200 border-pink-400';
            case 'warning':
                return 'bg-yellow-900 text-yellow-200 border-yellow-400';
            default:
                return 'bg-neutral-900 text-white border-gray-700';
        }
    };

    return (
        <div className={`p-2 md:p-3 rounded-md text-xs md:text-sm border ${getFeedbackStyles(feedback.type)}`}>
            <div className="flex items-center justify-between">
                <span>{feedback.message}</span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-2 text-xs opacity-70 hover:opacity-100"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}; 