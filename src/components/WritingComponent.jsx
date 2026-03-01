import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { CheckCircle2, XCircle, Type } from 'lucide-react';
import AITutorButton from './AITutorButton';
import clsx from 'clsx';

const WritingComponent = ({ data }) => {
    const { answers, saveAnswer, incrementScore } = useStore();
    const saved = answers[data.id];

    const [answer, setAnswer] = useState(saved?.userAnswer || '');
    const [isSubmitted, setIsSubmitted] = useState(!!saved);
    const inputRef = useRef(null);

    useEffect(() => {
        const stored = useStore.getState().answers[data.id];
        setAnswer(stored?.userAnswer || '');
        setIsSubmitted(!!stored);

        if (inputRef.current && !stored) {
            inputRef.current.focus();
        }
    }, [data.id]);

    const normalizeText = (text) => {
        return text.trim().toLowerCase().replace(/[.,!?]$/, "");
    };

    const checkCorrect = () => {
        const userNormalized = normalizeText(answer);
        return data.correctAnswers.some(correct => normalizeText(correct) === userNormalized);
    };

    const isCorrect = isSubmitted ? checkCorrect() : false;

    const handleSubmit = () => {
        if (!answer.trim()) return;

        setIsSubmitted(true);
        const correct = checkCorrect();

        if (correct) {
            incrementScore(15);
        }
        saveAnswer(data.id, answer.trim(), correct);
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="mb-8">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-100 rounded-full">
                    {data.skill}
                </span>
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 relative mb-6">
                    <Type className="absolute text-slate-300 w-24 h-24 -right-4 -top-4 opacity-30 rotate-12" />
                    <h2 className="text-xl font-medium text-slate-700 leading-relaxed italic whitespace-pre-wrap">
                        "{data.question}"
                    </h2>
                </div>
            </div>

            <div className="mb-6 relative">
                <textarea
                    ref={inputRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={isSubmitted}
                    placeholder="Type your answer here..."
                    className={clsx(
                        "w-full min-h-[120px] p-6 text-lg rounded-2xl border-2 outline-none transition-all resize-none shadow-sm",
                        !isSubmitted ? "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-slate-800" : "",
                        isSubmitted && isCorrect ? "border-green-500 bg-green-50 text-green-800" : "",
                        isSubmitted && !isCorrect ? "border-red-500 bg-red-50 text-red-800" : ""
                    )}
                />

                {isSubmitted && (
                    <div className="absolute right-4 top-6">
                        {isCorrect ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
                    </div>
                )}
            </div>

            {!isSubmitted && <AITutorButton />}

            {isSubmitted && (
                <div className={clsx(
                    "p-6 mt-8 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden",
                    isCorrect ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"
                )}>
                    <div className="flex gap-4 relative z-10 w-full">
                        <div className={clsx(
                            "p-2 rounded-full h-fit flex-shrink-0",
                            isCorrect ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                        )}>
                            {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                        </div>
                        <div className="w-full">
                            <h3 className="font-bold text-xl mb-1">
                                {isCorrect ? "Perfect sentence!" : "Not quite."}
                            </h3>
                            {!isCorrect && (
                                <div className="mt-3 w-full">
                                    <p className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-2 text-red-800">Possible Correct Answers:</p>
                                    <ul className="space-y-2 w-full">
                                        {data.correctAnswers.map((ans, i) => (
                                            <li key={i} className="text-base font-medium bg-white/40 px-3 py-2 rounded-lg text-red-900 break-words w-full">
                                                {ans}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!isSubmitted && (
                <div className="mt-8 border-t border-slate-200 pt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!answer.trim()}
                        className={clsx(
                            "px-8 py-3 rounded-xl font-bold text-white transition-all",
                            answer.trim()
                                ? "bg-blue-500 hover:bg-blue-600 shadow-[0_4px_0_rgb(37,99,235)] active:translate-y-1 active:shadow-none"
                                : "bg-slate-300 cursor-not-allowed"
                        )}
                    >
                        Kiểm Tra Đáp Án
                    </button>
                </div>
            )}
        </div>
    );
};

export default WritingComponent;
