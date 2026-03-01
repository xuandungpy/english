import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { CheckCircle2, XCircle, Play, Pause, Volume2 } from 'lucide-react';
import AITutorButton from './AITutorButton';
import clsx from 'clsx';

const ListeningComponent = ({ data }) => {
    const { answers, saveAnswer, incrementScore, setAudioPlaying } = useStore();

    const saved = answers[data.id];
    const [answer, setAnswer] = useState(saved?.userAnswer || '');
    const [isSubmitted, setIsSubmitted] = useState(!!saved);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const stored = useStore.getState().answers[data.id];
        setAnswer(stored?.userAnswer || '');
        setIsSubmitted(!!stored);
        setIsPlaying(false);
        setAudioPlaying(false);
    }, [data.id, setAudioPlaying]);

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            setAudioPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
            setAudioPlaying(true);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            setIsPlaying(false);
            setAudioPlaying(false);
        };
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, []);

    const normalizeText = (text) => text.trim().toLowerCase().replace(/[.,!?]$/, "");

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

    const questionParts = data.question.split('______');

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-100 rounded-full">
                        {data.skill}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800">Listen and complete sentence.</h2>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-slate-200 rounded-3xl mb-8">
                <button
                    onClick={toggleAudio}
                    className={clsx(
                        "w-20 h-20 rounded-2xl flex items-center justify-center transition-all bg-blue-500 text-white shadow-[0_6px_0_rgb(37,99,235)] hover:bg-blue-600 active:translate-y-1 active:shadow-none mb-6",
                        isPlaying && "animate-pulse"
                    )}
                >
                    {isPlaying ? <Volume2 className="w-10 h-10 animate-bounce" /> : <Play className="w-10 h-10 ml-1" />}
                </button>
                <p className="text-slate-500 font-medium text-sm">
                    {isPlaying ? 'Playing audio...' : 'Click to play'}
                </p>
                <audio ref={audioRef} className="hidden" src={data.audioUrl} />
            </div>

            <div className="mb-8">
                <label className="block text-slate-700 text-lg font-medium mb-4 text-center">
                    {questionParts[0]}
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={isSubmitted}
                        placeholder="type answer..."
                        className={clsx(
                            "mx-2 px-4 py-2 w-40 text-center border-b-4 bg-transparent outline-none transition-colors",
                            !isSubmitted ? "border-slate-300 focus:border-blue-500 text-blue-600 font-bold" : "",
                            isSubmitted && isCorrect ? "border-green-500 text-green-600 font-bold bg-green-50 rounded" : "",
                            isSubmitted && !isCorrect ? "border-red-500 text-red-600 font-bold bg-red-50 rounded line-through opacity-70" : ""
                        )}
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                    {questionParts[1]}
                </label>
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
                                {isCorrect ? "Great ear!" : "Keep practicing."}
                            </h3>
                            <p className={clsx("text-base font-medium", isCorrect ? "text-green-800" : "text-red-800")}>
                                Transcript: "{data.transcript}"
                            </p>
                            {!isCorrect && (
                                <p className="text-red-700 mt-1">Correct answer: <span className="font-bold">{data.correctAnswers[0]}</span></p>
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

export default ListeningComponent;
