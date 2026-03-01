import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import AITutorButton from './AITutorButton';
import clsx from 'clsx';

const ReadingBlankComponent = ({ data }) => {
    const { answers, saveAnswer, incrementScore } = useStore();
    const saved = answers[data.id];

    const [answer, setAnswer] = useState(saved?.userAnswer || '');
    const [isSubmitted, setIsSubmitted] = useState(!!saved);

    useEffect(() => {
        const stored = useStore.getState().answers[data.id];
        setAnswer(stored?.userAnswer || '');
        setIsSubmitted(!!stored);
    }, [data.id]);

    const normalizeText = (text) => text.trim().toLowerCase().replace(/[.,!?]/g, "");

    const checkCorrect = () => {
        const userNormalized = normalizeText(answer);
        return data.correctAnswers.some(correct => normalizeText(correct) === userNormalized);
    };

    const isCorrect = isSubmitted ? checkCorrect() : false;

    const handleSubmit = () => {
        if (!answer.trim()) return;
        setIsSubmitted(true);
        const correct = checkCorrect();
        if (correct) incrementScore(10);
        saveAnswer(data.id, answer.trim(), correct);
    };

    const questionParts = data.question.split('______');

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

            <div className="flex-1 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold w-fit text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full">
                    {data.skill} Fill-in-the-blank
                </span>

                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 mb-6 text-lg text-slate-800 font-medium">
                    {questionParts[0]}
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={isSubmitted}
                        placeholder="word"
                        className={clsx(
                            "mx-2 px-3 py-1 w-32 text-center border-b-4 bg-transparent outline-none transition-all font-bold",
                            !isSubmitted ? "border-slate-300 focus:border-blue-500 text-blue-600" : "",
                            isSubmitted && isCorrect ? "border-green-500 text-green-600 bg-green-50 rounded" : "",
                            isSubmitted && !isCorrect ? "border-red-500 text-red-600 bg-red-50 rounded opacity-80 line-through" : ""
                        )}
                    />
                    {questionParts[1]}
                </div>

                {!isSubmitted && <AITutorButton />}

                {isSubmitted && (
                    <div className={clsx(
                        "p-5 mt-4 rounded-xl flex items-center justify-between",
                        isCorrect ? "bg-green-100" : "bg-red-100"
                    )}>
                        <div>
                            {isCorrect ? (
                                <p className="text-green-800 font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Correct!</p>
                            ) : (
                                <p className="text-red-800 font-bold flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />
                                    Answer: {data.correctAnswers[0]}
                                </p>
                            )}
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
        </div>
    );
};

export default ReadingBlankComponent;
