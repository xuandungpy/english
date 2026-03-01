import React, { useState, useEffect } from 'react';
import useStore from './store/useStore';
import Layout from './components/Layout';
import MultipleChoiceComponent from './components/MultipleChoiceComponent';
import ListeningComponent from './components/ListeningComponent';
import WritingComponent from './components/WritingComponent';
import WritingShortComponent from './components/WritingShortComponent';
import ReadingBlankComponent from './components/ReadingBlankComponent';
import ReadingMultipleComponent from './components/ReadingMultipleComponent';
import { Trophy, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, BookOpen, GraduationCap } from 'lucide-react';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const { score, answers, resetTest, testUrl, startTest } = useStore();

  useEffect(() => {
    if (!testUrl) return;
    setLoading(true);
    fetch(testUrl)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setFinished(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading questions", err);
        setLoading(false);
      });
  }, [testUrl]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    const confirmSubmit = window.confirm("Are you sure you want to submit your test?");
    if (confirmSubmit) {
      setFinished(true);
    }
  };

  const restartTest = () => {
    resetTest();
    setCurrentIndex(0);
    setFinished(false);
  };

  if (!testUrl) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-soft-light">
        <div className="max-w-4xl w-full text-center mb-12 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <div className="bg-white p-6 rounded-3xl inline-block mb-6 shadow-sm border-2 border-slate-100">
            <GraduationCap className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-6 drop-shadow-sm">Bài Kiểm Tra Tiếng Anh 7</h1>
          <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto">Vui lòng chọn một bài kiểm tra bên dưới để bắt đầu ôn tập.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-300 fill-mode-both">
          <button
            onClick={() => startTest('Unit 6', '/data/unit6.json')}
            className="bg-white p-8 rounded-3xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center sm:items-start group"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Bài Kiểm Tra Unit 6</h3>
            <p className="text-slate-500 font-medium text-center sm:text-left">Giáo Dục</p>
          </button>

          <button
            onClick={() => startTest('Unit 7', '/data/unit7.json')}
            className="bg-white p-8 rounded-3xl border-2 border-slate-200 hover:border-amber-500 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center sm:items-start group"
          >
            <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
              <BookOpen className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Bài Kiểm Tra Unit 7</h3>
            <p className="text-slate-500 font-medium text-center sm:text-left">Giao Thông</p>
          </button>

          <button
            onClick={() => startTest('Midterm 2', '/data/midterm.json')}
            className="bg-white p-8 rounded-3xl border-2 border-slate-200 hover:border-green-500 hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col items-center sm:items-start group"
          >
            <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Bài Giữa Kỳ</h3>
            <p className="text-slate-500 font-medium text-center sm:text-left">Ôn Tập Học Kỳ 2</p>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (finished) {
    const totalAnswered = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter(a => a.isCorrect).length;

    // Group missed questions
    const missedQuestions = questions.filter(q => !answers[q.id]?.isCorrect);

    return (
      <Layout questions={questions} currentIndex={currentIndex}>
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border-2 border-slate-100 animate-in fade-in zoom-in slide-in-from-bottom-8">
          <div className="text-center mb-12">
            <div className="bg-amber-100 p-6 rounded-full inline-block mb-6 relative">
              <Trophy className="w-20 h-20 text-amber-500 mx-auto" />
              <div className="absolute -top-2 -right-2 text-4xl">✨</div>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Kết Quả Bài Làm</h2>
            <p className="text-xl text-slate-600 max-w-md mx-auto">
              Bạn đã trả lời <span className="font-bold text-blue-600">{totalAnswered}</span> trên tổng số <span className="font-bold">{questions.length}</span> câu hỏi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-2xl mx-auto mb-12">
            <div className="bg-blue-50 px-8 py-6 rounded-2xl flex-1 text-center border-2 border-blue-100">
              <p className="text-blue-600 font-bold mb-2 uppercase tracking-widest text-sm">Số Câu Đúng</p>
              <p className="text-5xl font-black text-blue-700">{correctCount} <span className="text-2xl text-blue-400">/ {questions.length}</span></p>
            </div>
            <div className="bg-amber-50 px-8 py-6 rounded-2xl flex-1 text-center border-2 border-amber-100">
              <p className="text-amber-600 font-bold mb-2 uppercase tracking-widest text-sm">Tổng Điểm</p>
              <p className="text-5xl font-black text-amber-700">{score}</p>
            </div>
          </div>

          {missedQuestions.length > 0 && (
            <div className="mt-12 w-full max-w-3xl mx-auto text-left">
              <h3 className="text-2xl font-bold border-b-2 border-slate-200 pb-4 mb-6 flex items-center gap-2 text-slate-800">
                <AlertCircle className="text-red-500 w-6 h-6" /> Xem Lại Các Câu Hỏi Chưa Đúng
              </h3>
              <div className="space-y-6">
                {missedQuestions.map((q, idx) => {
                  const userAnswer = answers[q.id]?.userAnswer;
                  const correctAns = q.correctAnswer || (q.correctAnswers && q.correctAnswers[0]);

                  return (
                    <div key={q.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="flex gap-3 mb-3 items-start">
                        <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-lg font-bold text-sm shrink-0 mt-0.5">
                          {q.skill}
                        </span>
                        <p className="text-lg font-medium text-slate-800" dangerouslySetInnerHTML={{ __html: q.question }}></p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                          <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Câu trả lời của bạn:</p>
                          <p className="text-red-700 line-through font-medium" dangerouslySetInnerHTML={{ __html: userAnswer || "Chưa chọn đáp án" }} />
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                          <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Đáp án đúng:</p>
                          <p className="text-green-700 font-bold" dangerouslySetInnerHTML={{ __html: correctAns }} />
                        </div>
                      </div>
                      {q.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 text-blue-900 rounded-xl text-sm italic border border-blue-100">
                          <strong>Giải thích:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={restartTest}
              className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-slate-900 shadow-[0_6px_0_rgb(15,23,42)] active:translate-y-1 active:shadow-none transition-all inline-flex items-center gap-2"
            >
              Làm Lại Bài
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentIndex];

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return <MultipleChoiceComponent data={currentQuestion} key={currentQuestion.id} />;
      case 'listening':
      case 'listening-blank':
        return <ListeningComponent data={currentQuestion} key={currentQuestion.id} />;
      case 'writing':
        return <WritingComponent data={currentQuestion} key={currentQuestion.id} />;
      case 'writing-short':
        return <WritingShortComponent data={currentQuestion} key={currentQuestion.id} />;
      case 'reading-blank':
        return <ReadingBlankComponent data={currentQuestion} key={currentQuestion.id} />;
      case 'reading-multiple':
        return <ReadingMultipleComponent data={currentQuestion} key={currentQuestion.id} />;
      default:
        return <div>Unknown question type</div>;
    }
  };

  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <Layout questions={questions} currentIndex={currentIndex} onSelectQuestion={setCurrentIndex}>
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border-2 border-slate-100 min-h-[500px] flex flex-col justify-center">
        {renderQuestion()}
      </div>

      {/* Global Navigation Footer */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white border-t border-slate-200 p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentIndex === 0
              ? 'text-slate-300 cursor-not-allowed bg-slate-50'
              : 'text-slate-700 hover:bg-slate-100 border-2 border-slate-200'
              }`}
          >
            <ChevronLeft className="w-5 h-5" /> Lùi
          </button>

          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-500">
              Đã trả lời: <span className="text-blue-600">{answeredCount}</span> / {questions.length}
            </p>
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitTest}
              className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 shadow-[0_4px_0_rgb(22,163,74)] active:translate-y-1 active:shadow-none transition-all"
            >
              Nộp Bài <CheckCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 shadow-[0_4px_0_rgb(37,99,235)] active:translate-y-1 active:shadow-none transition-all"
            >
              Tới <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
