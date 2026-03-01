import React, { useState } from 'react';
import { BotMessageSquare, Sparkles } from 'lucide-react';

const AITutorButton = () => {
    const [suggestion, setSuggestion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAskAI = () => {
        setIsLoading(true);
        // Mock API call
        setTimeout(() => {
            setSuggestion("The AI tutor suggests looking at the verb tense!");
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="mt-4">
            {!suggestion ? (
                <button
                    onClick={handleAskAI}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                    {isLoading ? (
                        <span className="animate-pulse">Thinking...</span>
                    ) : (
                        <>
                            <BotMessageSquare className="w-4 h-4" />
                            Ask AI Tutor
                        </>
                    )}
                </button>
            ) : (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl text-purple-900 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-2 bg-purple-200 rounded-full">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-1 text-purple-800">AI Tutor Suggestion</h4>
                        <p className="text-sm">{suggestion}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AITutorButton;
