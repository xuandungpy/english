import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { CheckCircle2, XCircle } from 'lucide-react';
import AITutorButton from './AITutorButton';
import clsx from 'clsx';

const MultipleChoiceComponent = ({ data }) => {
    const { answers, saveAnswer, incrementScore } = useStore();

    const saved = answers[data.id];
    const [selected, setSelected] = useState(saved?.userAnswer || null);
    const [isSubmitted, setIsSubmitted] = useState(!!saved);

    useEffect(() => {
        const stored = useStore.getState().answers[data.id];
        setSelected(stored?.userAnswer || null);
        setIsSubmitted(!!stored);
    }, [data.id]);

    const isCorrect = selected === data.correctAnswer;

    const handleSubmit = () => {
        if (!selected) return;
        setIsSubmitted(true);
        const correct = selected === data.correctAnswer;
        if (correct) {
            incrementScore(10);
        }
        saveAnswer(data.id, selected, correct);
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="mb-6">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full">
                    {data.skill}
                </span>
                <h2 className="text-2xl font-bold text-slate-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: data.question }} />
            </div>

            <div className="space-y-3 mb-8">
                {data.options.map((option, index) => {
                    const isSelected = selected === option;
                    const showSuccess = isSubmitted && option === data.correctAnswer;
                    const showError = isSubmitted && isSelected && !isCorrect;

                    return (
                        <button
                            key={index}
                            onClick={() => !isSubmitted && setSelected(option)}
                            disabled={isSubmitted}
                            className={clsx(
                                "w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 flex justify-between items-center group relative overflow-hidden",
                                !isSubmitted && !isSelected && "border-slate-200 hover:border-blue-400 hover:bg-slate-50 text-slate-700",
                                !isSubmitted && isSelected && "border-blue-500 bg-blue-50 text-blue-700",
                                showSuccess && "border-green-500 bg-green-50 text-green-700",
                                showError && "border-red-500 bg-red-50 text-red-700",
                                isSubmitted && !showSuccess && !showError && "border-slate-200 opacity-50 cursor-not-allowed"
                            )}
                        >
                            <span className="text-lg font-medium relative z-10" dangerouslySetInnerHTML={{ __html: option }} />
                            {showSuccess && <CheckCircle2 className="w-6 h-6 text-green-500 relative z-10" />}
                            {showError && <XCircle className="w-6 h-6 text-red-500 relative z-10" />}

                            {!isSubmitted && (
                                <div className={clsx(
                                    "absolute inset-0 bg-blue-100/50 scale-x-0 origin-left transition-transform duration-200",
                                    isSelected && "scale-x-100"
                                )} />
                            )}
                        </button>
                    );
                })}
            </div>

            {!isSubmitted && <AITutorButton />}

            {isSubmitted && (
                <div className={clsx(
                    "p-6 mt-8 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center animate-in fade-in slide-in-from-bottom-4",
                    isCorrect ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"
                )}>
                    <div className="flex gap-4">
                        <div className={clsx(
                            "p-2 rounded-full h-fit",
                            isCorrect ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                        )}>
                            {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-1">
                                {isCorrect ? "Excellent!" : "Not quite right."}
                            </h3>
                            <p className={clsx("text-base opacity-90", isCorrect ? "text-green-800" : "text-red-800")}>
                                {data.explanation || `The correct answer is "${data.correctAnswer}".`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!isSubmitted && (
                <div className="mt-8 border-t border-slate-200 pt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!selected}
                        className={clsx(
                            "px-8 py-3 rounded-xl font-bold text-white transition-all",
                            selected
                                ? "bg-blue-500 hover:bg-blue-600 shadow-[0_4px_0_rgb(37,99,235)] active:translate-y-1 active:shadow-none"
                                : "bg-slate-300 cursor-not-allowed"
                        )}
                    >
                        Check Answer
                    </button>
                </div>
            )}
        </div>
    );
};

export default MultipleChoiceComponent;
