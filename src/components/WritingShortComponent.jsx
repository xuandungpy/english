import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { CheckCircle2, XCircle, Type } from 'lucide-react';
import AITutorButton from './AITutorButton';
import clsx from 'clsx';

const WritingShortComponent = ({ data }) => {
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
            incrementScore(10);
        }
        saveAnswer(data.id, answer.trim(), correct);
    };

    const parts = data.question.split('__________');

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="mb-8">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-100 rounded-full">
                    {data.skill}
                </span>
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 relative mb-6">
                    <Type className="absolute text-slate-300 w-24 h-24 -right-4 -top-4 opacity-30 rotate-12" />
                    <h2 className="text-xl font-medium text-slate-700 leading-relaxed italic">
                        Complete the sentence:
                    </h2>
                    {parts.length > 1 ? (
                        <p className="mt-4 text-lg text-slate-800">
                            {parts[0]} <span className="font-bold underline text-blue-600 px-2">{isSubmitted ? (isCorrect ? answer : data.correctAnswers[0]) : "______"}</span> {parts[1]}
                        </p>
                    ) : (
                        <p className="mt-4 text-lg text-slate-800">{data.question}</p>
                    )}
                </div>
            </div>

            <div className="mb-6 relative flex justify-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={isSubmitted}
                    placeholder="Type the exact word..."
                    className={clsx(
                        "w-full max-w-sm px-6 py-4 text-center font-bold text-xl rounded-2xl border-2 outline-none transition-all shadow-sm",
                        !isSubmitted ? "border-slate-300 focus:border-blue-500 text-slate-800" : "",
                        isSubmitted && isCorrect ? "border-green-500 bg-green-50 text-green-800" : "",
                        isSubmitted && !isCorrect ? "border-red-500 bg-red-50 text-red-800 line-through" : ""
                    )}
                />

                {isSubmitted && (
                    <div className="absolute -right-2 top-4">
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
                    <div className="flex gap-4 relative z-10">
                        <div className={clsx(
                            "p-2 rounded-full h-fit flex-shrink-0",
                            isCorrect ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                        )}>
                            {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-1">
                                {isCorrect ? "Perfect!" : "Not quite."}
                            </h3>
                            {!isCorrect && (
                                <div className="mt-2">
                                    <p className="text-red-700">The correct word is: <span className="font-bold text-lg">{data.correctAnswers[0]}</span></p>
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
                        Check Answer
                    </button>
                </div>
            )}
        </div>
    );
};

export default WritingShortComponent;
