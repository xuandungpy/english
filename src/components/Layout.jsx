import React from 'react';
import useStore from '../store/useStore';
import { BookOpen, Trophy, Menu, Map, Star, GraduationCap, Grip } from 'lucide-react';
import clsx from 'clsx';

const Layout = ({ children, questions = [], currentIndex = 0, onSelectQuestion }) => {
    const { score, currentUnit, answers } = useStore();

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 shadow-sm z-20">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-blue-600">
                        <GraduationCap className="w-8 h-8" />
                        <span className="text-xl font-bold tracking-tight">Mini LMS</span>
                    </div>
                </div>

                <div className="p-6 border-b border-slate-200 bg-amber-50">
                    <p className="text-amber-800 font-bold mb-1 items-center flex gap-2"><Trophy className="w-4 h-4" /> Your Score</p>
                    <p className="text-3xl font-black text-amber-600">{score}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-700">
                        <Grip className="w-5 h-5" />
                        <h3 className="font-bold">Questions List</h3>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => {
                            const isAnswered = !!answers[q.id];
                            const isActive = currentIndex === idx;

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => onSelectQuestion && onSelectQuestion(idx)}
                                    className={clsx(
                                        "w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all border-2",
                                        isActive ? "border-blue-500 ring-4 ring-blue-100 scale-110 z-10" : "border-transparent",
                                        isAnswered && !isActive ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "",
                                        !isAnswered && !isActive ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "",
                                        isActive && isAnswered ? "bg-blue-500 text-white" : "",
                                        isActive && !isAnswered ? "bg-white text-blue-600 border-blue-500" : ""
                                    )}
                                    title={isAnswered ? "Answered" : "Not Answered"}
                                >
                                    {idx + 1}
                                </button>
                            )
                        })}
                    </div>
                    <div className="mt-6 flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div> Answered</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div> Unanswered</span>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Map className="w-5 h-5 text-slate-400 hidden sm:block" />
                            <h1 className="text-xl font-bold text-slate-800">{currentUnit} - Final Test</h1>
                        </div>
                    </div>
                    <div className="md:hidden flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-amber-700">{score}</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 flex items-center justify-center relative bg-slate-50/50">
                    <div className="w-full max-w-4xl pb-24">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
