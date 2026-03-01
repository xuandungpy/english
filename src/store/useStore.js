import { create } from 'zustand';

const useStore = create((set) => ({
    score: 0,
    currentUnit: null,
    testUrl: null,
    isAudioPlaying: false,
    answers: {}, // map of { questionId: { userAnswer, isCorrect } }

    incrementScore: (points = 10) => set((state) => ({ score: state.score + points })),
    setUnit: (unit) => set({ currentUnit: unit }),
    setAudioPlaying: (isPlaying) => set({ isAudioPlaying: isPlaying }),

    startTest: (unit, url) => set({ currentUnit: unit, testUrl: url, score: 0, answers: {} }),
    quitTest: () => set({ currentUnit: null, testUrl: null, score: 0, answers: {} }),

    // Save answer
    saveAnswer: (questionId, userAnswer, isCorrect) => set((state) => ({
        answers: {
            ...state.answers,
            [questionId]: { userAnswer, isCorrect }
        }
    })),

    resetTest: () => set({ score: 0, answers: {} })
}));

export default useStore;
