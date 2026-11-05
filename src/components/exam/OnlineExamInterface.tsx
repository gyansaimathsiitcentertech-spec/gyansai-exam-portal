import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  GraduationCap,
  Clock,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
  ArrowLeft,
  Award,
  BarChart2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, StudentAnswer, ExamAttempt } from '../../types';

export const OnlineExamInterface: React.FC = () => {
  const {
    activeExamIdForCBT,
    setActiveExamIdForCBT,
    setPortalMode,
    exams,
    questions,
    currentUser,
    recordAttempt,
    setSelectedAttemptForResult
  } = usePortal();

  const exam = exams.find(e => e.id === activeExamIdForCBT) || exams[0];

  // Flatten questions according to sections
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = exam?.sections[currentSectionIndex] || exam?.sections[0];

  // Map of all questions in current exam with robust fallback
  const allExamQuestionIds = (exam && exam.sections && exam.sections.length > 0)
    ? exam.sections.flatMap(s => s.questionIds)
    : [];
  const matched = allExamQuestionIds
    .map(id => questions.find(q => q.id === id))
    .filter(Boolean) as Question[];
  const allExamQuestions: Question[] = matched.length > 0 ? matched : questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion: Question | undefined = allExamQuestions[currentQuestionIndex];

  // Timer: remaining seconds
  const [timeRemaining, setTimeRemaining] = useState<number>(() => (exam?.durationMinutes || 180) * 60);

  // Candidate answers state
  // key: questionId -> StudentAnswer
  const [candidateAnswers, setCandidateAnswers] = useState<Record<string, StudentAnswer>>(() => {
    const initial: Record<string, StudentAnswer> = {};
    allExamQuestions.forEach((q, idx) => {
      initial[q.id] = {
        questionId: q.id,
        selectedOption: '',
        status: idx === 0 ? 'not_answered' : 'not_visited',
        timeSpentSeconds: 0
      };
    });
    return initial;
  });

  const [confirmSubmitModalOpen, setConfirmSubmitModalOpen] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState<ExamAttempt | null>(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionLabel: string) => {
    if (!currentQuestion) return;
    setCandidateAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { questionId: currentQuestion.id, timeSpentSeconds: 0 }),
        selectedOption: optionLabel,
        status: 'answered'
      }
    }));
  };

  const handleNumericalInput = (val: string) => {
    if (!currentQuestion) return;
    setCandidateAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { questionId: currentQuestion.id, timeSpentSeconds: 0 }),
        selectedOption: val,
        status: val.trim() ? 'answered' : 'not_answered'
      }
    }));
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setCandidateAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { questionId: currentQuestion.id, timeSpentSeconds: 0 }),
        selectedOption: '',
        status: 'not_answered'
      }
    }));
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;
    const currentAns = candidateAnswers[currentQuestion.id]?.selectedOption;
    setCandidateAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { questionId: currentQuestion.id, timeSpentSeconds: 0 }),
        status: currentAns ? 'answered_and_marked' : 'marked_for_review'
      }
    }));
    jumpToNextQuestion();
  };

  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const currentAns = candidateAnswers[currentQuestion.id]?.selectedOption;
    setCandidateAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { questionId: currentQuestion.id, timeSpentSeconds: 0 }),
        status: currentAns ? 'answered' : 'not_answered'
      }
    }));
    jumpToNextQuestion();
  };

  const jumpToNextQuestion = () => {
    if (currentQuestionIndex < allExamQuestions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      const nextQ = allExamQuestions[nextIdx];
      // If next question was not_visited, mark as not_answered
      if (candidateAnswers[nextQ.id]?.status === 'not_visited') {
        setCandidateAnswers(prev => ({
          ...prev,
          [nextQ.id]: {
            ...prev[nextQ.id],
            status: 'not_answered'
          }
        }));
      }
    }
  };

  const jumpToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    const targetQ = allExamQuestions[index];
    if (candidateAnswers[targetQ.id]?.status === 'not_visited') {
      setCandidateAnswers(prev => ({
        ...prev,
        [targetQ.id]: {
          ...prev[targetQ.id],
          status: 'not_answered'
        }
      }));
    }
  };

  // Status counts for palette
  const answeredCount = Object.values(candidateAnswers).filter(a => a.status === 'answered').length;
  const notAnsweredCount = Object.values(candidateAnswers).filter(a => a.status === 'not_answered').length;
  const markedReviewCount = Object.values(candidateAnswers).filter(a => a.status === 'marked_for_review').length;
  const answeredAndMarkedCount = Object.values(candidateAnswers).filter(a => a.status === 'answered_and_marked').length;
  const notVisitedCount = allExamQuestions.length - (answeredCount + notAnsweredCount + markedReviewCount + answeredAndMarkedCount);

  // Submit test and compute scores
  const handleSubmitExam = () => {
    let calculatedScore = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const evaluatedAnswers: Record<string, StudentAnswer> = {};

    allExamQuestions.forEach(q => {
      const candidateAns = candidateAnswers[q.id]?.selectedOption?.trim() || '';
      let isCorrect = false;
      let marksAwarded = 0;

      if (!candidateAns) {
        unattempted++;
        marksAwarded = 0;
      } else {
        // Evaluate
        if (q.type === 'numerical') {
          // compare numerical tolerance
          const userNum = parseFloat(candidateAns);
          const correctNum = parseFloat(q.correctAnswer);
          if (!isNaN(userNum) && !isNaN(correctNum) && Math.abs(userNum - correctNum) < 0.1) {
            isCorrect = true;
          }
        } else {
          isCorrect = candidateAns.toUpperCase() === q.correctAnswer.toUpperCase();
        }

        if (isCorrect) {
          correct++;
          marksAwarded = q.marksPositive;
          calculatedScore += marksAwarded;
        } else {
          incorrect++;
          marksAwarded = q.marksNegative;
          calculatedScore += marksAwarded;
        }
      }

      evaluatedAnswers[q.id] = {
        questionId: q.id,
        selectedOption: candidateAns,
        status: candidateAns ? 'answered' : 'not_answered',
        timeSpentSeconds: 120,
        isCorrect,
        marksAwarded
      };
    });

    const maxScore = allExamQuestions.reduce((sum, q) => sum + q.marksPositive, 0) || exam.totalMarks;
    const finalPercentage = Math.max(0, Math.round((calculatedScore / maxScore) * 100 * 10) / 10);
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

    const newAttempt: ExamAttempt = recordAttempt({
      examId: exam.id,
      examTitle: exam.title,
      examCode: exam.code,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRollNo: currentUser.rollNo || 'GMI-ONLINE',
      studentEmail: currentUser.email,
      answers: evaluatedAnswers,
      totalScore: calculatedScore,
      maxScore,
      percentage: finalPercentage,
      accuracy,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: unattempted,
      rank: Math.max(1, 4 - Math.floor(calculatedScore / 10)),
      totalParticipants: 12,
      startedAt: new Date(Date.now() - (exam.durationMinutes * 60 - timeRemaining) * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      timeTakenMinutes: Math.round((exam.durationMinutes * 60 - timeRemaining) / 60) || 1,
      status: 'Evaluated'
    });

    setConfirmSubmitModalOpen(false);
    setSubmittedAttempt(newAttempt);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // If already submitted, show Post-Exam Scorecard & detailed solution review
  if (submittedAttempt) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start py-8 px-4">
        <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-4xl w-full p-6 space-y-6">
          {/* Header */}
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 uppercase">
                  Examination Successfully Submitted!
                </h1>
                <p className="text-xs text-slate-500">
                  {submittedAttempt.examTitle} ({submittedAttempt.examCode})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAttemptForResult(submittedAttempt);
                  setPortalMode('student');
                  setActiveExamIdForCBT(null);
                }}
                className="px-4 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Go to Student Portal
              </button>
            </div>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Score</span>
              <span className="text-xl font-extrabold text-[#1E3A8A]">
                {submittedAttempt.totalScore} / {submittedAttempt.maxScore}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Accuracy</span>
              <span className="text-xl font-extrabold text-emerald-700">
                {submittedAttempt.accuracy}%
              </span>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Estimated Rank</span>
              <span className="text-xl font-extrabold text-purple-800">
                #{submittedAttempt.rank || 1}
              </span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Time Taken</span>
              <span className="text-xl font-extrabold text-amber-800">
                {submittedAttempt.timeTakenMinutes} mins
              </span>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="flex items-center justify-around py-3 px-4 bg-slate-50 rounded border border-slate-200 text-xs">
            <div className="text-center">
              <span className="text-emerald-700 font-bold text-sm block">+{submittedAttempt.correctCount}</span>
              <span className="text-[10px] uppercase text-slate-500">Correct (+4 each)</span>
            </div>
            <div className="text-center">
              <span className="text-red-600 font-bold text-sm block">-{submittedAttempt.incorrectCount}</span>
              <span className="text-[10px] uppercase text-slate-500">Incorrect (-1 each)</span>
            </div>
            <div className="text-center">
              <span className="text-slate-600 font-bold text-sm block">{submittedAttempt.unattemptedCount}</span>
              <span className="text-[10px] uppercase text-slate-500">Unattempted (0)</span>
            </div>
          </div>

          {/* Question-by-Question Review with Explanations */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>Detailed Question Review & Official Solutions</span>
              <span className="text-[11px] text-slate-400 font-normal">Candidate: {submittedAttempt.studentName}</span>
            </h3>

            {allExamQuestions.map((q, idx) => {
              const ansRecord = submittedAttempt.answers[q.id];
              const isCorrect = ansRecord?.isCorrect;
              const hasAnswered = !!ansRecord?.selectedOption;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded border text-xs space-y-2.5 ${
                    !hasAnswered
                      ? 'border-slate-200 bg-slate-50/50'
                      : isCorrect
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-red-200 bg-red-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Q{idx + 1}. ({q.code}) - {q.topic}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        !hasAnswered
                          ? 'bg-slate-200 text-slate-700'
                          : isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {!hasAnswered ? 'Unattempted (0)' : isCorrect ? '+4 Marks (Correct)' : '-1 Mark (Wrong)'}
                    </span>
                  </div>

                  <p className="text-slate-800 font-medium">{q.questionText}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Your Answer</span>
                      <strong className={isCorrect ? 'text-emerald-700' : 'text-red-600'}>
                        {ansRecord?.selectedOption || 'None'}
                      </strong>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">Correct Key</span>
                      <strong className="text-emerald-800">{q.correctAnswer}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700">
                    <strong className="text-slate-900 block mb-0.5">Explanation / Solution:</strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentAnswer = currentQuestion ? candidateAnswers[currentQuestion.id] : undefined;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* 1. TOP EXAM HEADER */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#1E3A8A] text-white flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight truncate max-w-xs sm:max-w-md">
              {exam.title}
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold">
              GYANSAI MATHS IIT CENTER &bull; Code: {exam.code}
            </p>
          </div>
        </div>

        {/* Center Countdown Clock */}
        <div className="flex items-center space-x-2 bg-slate-100 border border-slate-300 px-3 py-1 rounded">
          <Clock className={`w-4 h-4 ${timeRemaining < 300 ? 'text-red-600 animate-pulse' : 'text-slate-600'}`} />
          <span className="text-[11px] font-bold uppercase text-slate-500 hidden sm:inline">Time Left:</span>
          <span
            className={`font-mono text-sm sm:text-base font-extrabold ${
              timeRemaining < 300 ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Right Candidate Profile Indicator */}
        <div className="flex items-center space-x-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 font-mono font-semibold">
              {currentUser.rollNo || 'GMI-CANDIDATE'}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xs font-bold uppercase">
            {currentUser.name.charAt(0)}
          </div>
        </div>
      </header>

      {/* 2. SECTION TABS */}
      <div className="bg-slate-200/90 border-b border-slate-300 px-4 py-1.5 flex items-center justify-between overflow-x-auto text-xs">
        <div className="flex items-center space-x-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-2 hidden md:inline">Sections:</span>
          {exam.sections.map((sec, idx) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setCurrentSectionIndex(idx);
                // find first question index of this section
                const firstQId = sec.questionIds[0];
                const qIdx = allExamQuestions.findIndex(q => q.id === firstQId);
                if (qIdx !== -1) handleJumpToQuestion(qIdx);
              }}
              className={`px-3 py-1 rounded font-semibold text-xs transition cursor-pointer ${
                currentSectionIndex === idx
                  ? 'bg-[#1E3A8A] text-white shadow-2xs'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-300'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-600 font-semibold hidden lg:block">
          Marking Scheme: <strong className="text-emerald-700">+{exam.positiveMarks}</strong>,{' '}
          <strong className="text-red-600">{exam.negativeMarks}</strong>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center: Question Panel */}
        <div className="flex-1 flex flex-col bg-white border-r border-slate-200 overflow-y-auto">
          {currentQuestion ? (
            <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Question Info Bar */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900 uppercase">
                      Question No. {currentQuestionIndex + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {currentQuestion.subject} &bull; {currentQuestion.topic}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-semibold">
                    <span className="text-emerald-700">Marks: +{currentQuestion.marksPositive}</span>
                    <span className="text-red-600">Negative: {currentQuestion.marksNegative}</span>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed py-2">
                  {currentQuestion.questionText}
                </div>

                {currentQuestion.imageUrl && (
                  <div className="py-2">
                    <img
                      src={currentQuestion.imageUrl}
                      alt="Question diagram"
                      className="max-h-64 max-w-full rounded border border-slate-300 bg-white p-1 object-contain"
                    />
                  </div>
                )}

                {currentQuestion.formulaNote && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900 font-mono">
                    <strong>Reference Property:</strong> {currentQuestion.formulaNote}
                  </div>
                )}

                {/* Options (SCQ) or Input (Numerical) */}
                {currentQuestion.type === 'numerical' ? (
                  <div className="py-4 space-y-2 max-w-sm">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Enter Numerical Value (Decimals allowed):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 128 or 21.33"
                      value={currentAnswer?.selectedOption || ''}
                      onChange={e => handleNumericalInput(e.target.value)}
                      className="w-full text-base font-mono font-bold px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                    />
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-2">
                    {currentQuestion.options.map(opt => {
                      const isSelected = currentAnswer?.selectedOption === opt.label;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => handleSelectOption(opt.label)}
                          className={`p-3.5 rounded border text-xs sm:text-sm flex items-center space-x-3 cursor-pointer transition ${
                            isSelected
                              ? 'bg-blue-50/80 border-[#1E3A8A] text-slate-900 font-semibold shadow-2xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              isSelected
                                ? 'bg-[#1E3A8A] text-white'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-6 mt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleClearResponse}
                    className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded cursor-pointer transition"
                  >
                    Clear Response
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkForReviewAndNext}
                    className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold rounded cursor-pointer transition"
                  >
                    Mark for Review & Next
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={jumpToPrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold rounded flex items-center space-x-1 cursor-pointer transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAndNext}
                    className="px-5 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold rounded shadow-xs flex items-center space-x-1 cursor-pointer transition"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">No questions in section</div>
          )}
        </div>

        {/* Right: Question Palette & Candidate Legend */}
        <div className="w-full lg:w-72 bg-slate-50 p-4 border-t lg:border-t-0 flex flex-col justify-between shrink-0 space-y-4 text-xs">
          {/* Candidate Card */}
          <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs flex items-center space-x-3">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm uppercase">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden">
              <span className="font-bold text-slate-900 block truncate">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">Roll: {currentUser.rollNo || 'GMI-CBT'}</span>
            </div>
          </div>

          {/* Palette Legend */}
          <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs space-y-1.5 text-[11px]">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Question Palette Status
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                  {answeredCount}
                </span>
                <span className="text-slate-600">Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-bold">
                  {notAnsweredCount}
                </span>
                <span className="text-slate-600">Not Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold">
                  {markedReviewCount}
                </span>
                <span className="text-slate-600">Marked Review</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold">
                  {notVisitedCount}
                </span>
                <span className="text-slate-600">Not Visited</span>
              </div>
            </div>
          </div>

          {/* Question Grid Buttons */}
          <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs flex-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Choose a Question:
            </div>
            <div className="grid grid-cols-5 gap-1.5 max-h-56 overflow-y-auto p-1">
              {allExamQuestions.map((q, idx) => {
                const ans = candidateAnswers[q.id];
                const status = ans?.status || 'not_visited';
                const isCurrent = currentQuestionIndex === idx;

                let btnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                if (status === 'answered') {
                  btnClass = 'bg-emerald-600 text-white';
                } else if (status === 'not_answered') {
                  btnClass = 'bg-red-600 text-white';
                } else if (status === 'marked_for_review') {
                  btnClass = 'bg-purple-600 text-white';
                } else if (status === 'answered_and_marked') {
                  btnClass = 'bg-purple-700 text-white ring-2 ring-emerald-400';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-8 rounded text-xs font-bold transition flex items-center justify-center cursor-pointer ${btnClass} ${
                      isCurrent ? 'ring-2 ring-blue-500 ring-offset-1 font-extrabold' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Test Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setConfirmSubmitModalOpen(true)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Entire Examination</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {confirmSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center space-x-2 text-slate-900 font-bold uppercase text-sm border-b border-slate-200 pb-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Confirm Examination Submission</span>
            </div>

            <p className="text-slate-600">
              Are you sure you want to finish and submit your test? Once submitted, answers cannot be modified.
            </p>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5 text-slate-700 font-medium">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <strong>{allExamQuestions.length}</strong>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Answered:</span>
                <strong>{answeredCount}</strong>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Not Answered:</span>
                <strong>{notAnsweredCount}</strong>
              </div>
              <div className="flex justify-between text-purple-700">
                <span>Marked for Review:</span>
                <strong>{markedReviewCount + answeredAndMarkedCount}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Not Visited:</span>
                <strong>{notVisitedCount}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setConfirmSubmitModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded hover:bg-slate-50 cursor-pointer"
              >
                Resume Test
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer shadow-xs"
              >
                Yes, Submit Test Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
