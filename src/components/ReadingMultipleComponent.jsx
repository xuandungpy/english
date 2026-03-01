import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import AITutorButton from './AITutorButton';
import clsx from 'clsx';

const ReadingMultipleComponent = ({ data }) => {
    const { answers, saveAnswer, incrementScore } = useStore();
    const saved = answers[data.id];

    const [selected, setSelected] = useState(saved?.userAnswer || null);
    const [isSubmitted, setIsSubmitted] = useState(!!saved);
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => {
        // Only shuffle once when mounting the current question data
        if (data && data.options) {
            const shuffled = [...data.options].sort(() => Math.random() - 0.5);
            setShuffledOptions(shuffled);
        }
    }, [data.id]);

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
        if (correct) incrementScore(10);
        saveAnswer(data.id, selected, correct);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto">
            <div className="flex-1 bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
                <div className="flex items-center gap-3 mb-4 text-amber-700 border-b border-amber-200 pb-4">
                    <BookOpen className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Reading Passage</h2>
                </div>
                <div className="text-slate-800 text-lg leading-relaxed space-y-4 font-serif">
                    {data.passage.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-start">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold w-fit text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full">
                    {data.skill} Multiple Choice
                </span>

                <h2 className="text-xl font-bold text-slate-800 mb-6">{data.question}</h2>

                <div className="space-y-3 mb-6">
                    {shuffledOptions.map((option, index) => {
                        const isSelected = selected === option;
                        const showSuccess = isSubmitted && option === data.correctAnswer;
                        const showError = isSubmitted && isSelected && !isCorrect;

                        return (
                            <button
                                key={index}
                                onClick={() => !isSubmitted && setSelected(option)}
                                disabled={isSubmitted}
                                className={clsx(
                                    "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex justify-between items-center",
                                    !isSubmitted && !isSelected && "border-slate-200 hover:border-blue-400 hover:bg-slate-50 text-slate-700",
                                    !isSubmitted && isSelected && "border-blue-500 bg-blue-50 text-blue-700",
                                    showSuccess && "border-green-500 bg-green-50 text-green-700",
                                    showError && "border-red-500 bg-red-50 text-red-700",
                                    isSubmitted && !showSuccess && !showError && "border-slate-200 opacity-50 cursor-not-allowed"
                                )}
                            >
                                <span className="text-base font-medium">{option}</span>
                                {showSuccess && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                {showError && <XCircle className="w-5 h-5 text-red-500" />}
                            </button>
                        );
                    })}
                </div>

                {!isSubmitted && <AITutorButton />}

                {isSubmitted && (
                    <div className={clsx(
                        "p-5 mt-4 rounded-xl flex items-center justify-between",
                        isCorrect ? "bg-green-100" : "bg-red-100"
                    )}>
                        <div>
                            {isCorrect ? (
                                <p className="text-green-800 font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Excellent!</p>
                            ) : (
                                <p className="text-red-800 font-bold flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Answer: {data.correctAnswer}
                                </p>
                            )}
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
                            Kiểm Tra Đáp Án
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadingMultipleComponent;
