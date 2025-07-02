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
                return 'bg-green-900 text-green-200 border-green-700';
            case 'error':
                return 'bg-red-900 text-red-200 border-red-700';
            case 'warning':
                return 'bg-yellow-900 text-yellow-200 border-yellow-700';
            case 'info':
                return 'bg-blue-900 text-blue-200 border-blue-700';
            default:
                return 'bg-gray-900 text-gray-200 border-gray-700';
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