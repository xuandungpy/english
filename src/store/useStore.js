import { create } from 'zustand';

const useStore = create((set) => ({
    score: 0,
    currentUnit: 'Unit 7',
    isAudioPlaying: false,
    answers: {}, // map of { questionId: { userAnswer, isCorrect } }

    incrementScore: (points = 10) => set((state) => ({ score: state.score + points })),
    setUnit: (unit) => set({ currentUnit: unit }),
    setAudioPlaying: (isPlaying) => set({ isAudioPlaying: isPlaying }),

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
