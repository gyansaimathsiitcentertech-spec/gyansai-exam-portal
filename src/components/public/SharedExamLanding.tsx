import React, { useMemo } from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  Clock,
  FileText,
  Shield,
  UserPlus,
  LogIn,
  Award,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { InstituteLogo } from '../common/InstituteLogo';

export const SharedExamLanding: React.FC = () => {
  const {
    settings,
    exams,
    activeExamIdForShare,
    setPortalMode,
    setQuickJoinModalOpen,
    setAuthModalOpen,
    setAuthModalTab,
    quickJoinAndStartExam
  } = usePortal();

  // Find targeted exam by ID or code, or fall back to the newest active exam
  const currentExam = useMemo(() => {
    if (!activeExamIdForShare) return exams[0];
    const match = exams.find(
      e => e.id.toLowerCase() === activeExamIdForShare.toLowerCase() ||
           e.code.toLowerCase() === activeExamIdForShare.toLowerCase()
    );
    return match || exams[0];
  }, [exams, activeExamIdForShare]);

  const questionsCount = useMemo(() => {
    if (currentExam?.questions && currentExam.questions.length > 0) {
      return currentExam.questions.length;
    }
    if (currentExam?.sections && currentExam.sections.length > 0) {
      return currentExam.sections.flatMap(s => s.questionIds || []).length;
    }
    return 10;
  }, [currentExam]);

  const totalMarks = currentExam?.totalMarks || (questionsCount * (currentExam?.positiveMarks || 4)) || 100;
  const passPercentage = currentExam?.passPercentage || 40;
  const passMarks = Math.round((totalMarks * passPercentage) / 100);
  const positiveMarks = currentExam?.positiveMarks || 4;
  const negativeMarks = currentExam?.negativeMarks !== undefined ? currentExam.negativeMarks : -1;

  const handleGuestQuickStart = () => {
    const randomGuestId = Math.floor(1000 + Math.random() * 9000);
    quickJoinAndStartExam(
      `Candidate ${randomGuestId}`,
      '9876543210',
      `guest.${randomGuestId}@gyansai.com`,
      currentExam?.targetClass || '12th',
      currentExam?.id || exams[0]?.id
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-100">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <div
          onClick={() => setPortalMode('landing')}
          className="flex items-center space-x-3 text-slate-900 font-semibold cursor-pointer select-none hover:opacity-90 transition"
        >
          <InstituteLogo
            className="w-9 h-9 rounded-md border border-slate-200 shadow-2xs"
            imgClassName="max-h-9 max-w-9 object-contain rounded-md"
            fallbackType="cap"
          />
          <div>
            <span className="text-sm font-extrabold tracking-tight text-[#002FA7] block">
              {settings?.instituteName || 'GYANSAI MATHS IIT CENTER'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              Computer-Based Test (CBT) Portal
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
            // LIVE EXAMINATION
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 my-auto space-y-6">
        {/* Exam Title & Tag Badges */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-[10px] font-mono font-bold tracking-widest text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
              // ASSESSMENT INVITATION
            </div>
            <div className="text-xs font-mono text-slate-500">
              Exam Code: <span className="font-bold text-slate-900">{currentExam?.code || 'GYAN-CBT-TEST'}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {currentExam?.title || 'Mathematics IIT-JEE Mock Assessment'}
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 font-mono">
              Folder: <span className="text-slate-800 font-semibold">{currentExam?.folderName || 'General Practice'}</span> &bull; Status: <span className="text-emerald-700 font-bold">Active & Open</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded text-xs font-semibold">
              Class: {currentExam?.targetClass || '11th & 12th'}
            </span>
            <span className="px-2.5 py-1 bg-[#002FA7] text-white rounded text-xs font-semibold">
              {currentExam?.examCategory || 'IIT-JEE / MHT-CET'}
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Marking: +{positiveMarks} / {negativeMarks}</span>
            </span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs">
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1">
              DURATION
            </div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-700" />
              <span>{currentExam?.durationMinutes || 180} min</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Automatic auto-submit countdown</p>
          </div>

          <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs">
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1">
              QUESTIONS
            </div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{questionsCount} Questions</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Single & Multi-choice CBT format</p>
          </div>

          <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-2xs">
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase mb-1">
              MAX MARKS & PASS CRITERIA
            </div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>{totalMarks} Marks</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Pass criteria: {passMarks} marks ({passPercentage}%)</p>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
            <Shield className="w-4 h-4 text-[#002FA7]" />
            <span className="uppercase tracking-wider">Candidate Instructions & Guidelines</span>
          </div>
          
          <ul className="space-y-2 text-xs text-slate-600">
            {(currentExam?.instructions && currentExam.instructions.length > 0) ? (
              currentExam.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="font-mono text-[#002FA7] font-bold mt-0.5">•</span>
                  <span>{inst}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-[#002FA7] font-bold mt-0.5">•</span>
                  <span>Each question contains four options with standard marking (+{positiveMarks} for correct, {negativeMarks} for incorrect response).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-[#002FA7] font-bold mt-0.5">•</span>
                  <span>Ensure your internet connection remains stable. Answers are saved locally in real-time.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-mono text-[#002FA7] font-bold mt-0.5">•</span>
                  <span>Upon submission, you can immediately download your official PDF answer key and view step-by-step solutions.</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setQuickJoinModalOpen(true)}
            className="py-3 px-4 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded-md flex items-center justify-center space-x-2 cursor-pointer shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Quick Join (Register & Start)</span>
          </button>

          <button
            type="button"
            onClick={handleGuestQuickStart}
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md flex items-center justify-center space-x-2 cursor-pointer shadow-sm transition"
            title="Start test immediately as guest aspirant"
          >
            <Play className="w-4 h-4" />
            <span>Instant Guest Start</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setAuthModalOpen(true);
            }}
            className="py-3 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-md flex items-center justify-center space-x-2 cursor-pointer transition shadow-2xs"
          >
            <LogIn className="w-4 h-4 text-slate-600" />
            <span>Student Portal Login</span>
          </button>
        </div>

        {/* Helper Footnote */}
        <div className="text-[11px] text-slate-500 space-y-1 pt-1 leading-relaxed border-t border-slate-200">
          <p>
            <strong className="text-slate-700">Quick Join:</strong> Instant candidate entry with automated roll number generation (recommended for open mock tests).
          </p>
          <p>
            <strong className="text-slate-700">Result & Solutions:</strong> Full evaluation, All-India Percentile analysis, and downloadable PDF solution sheets available immediately upon submission.
          </p>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="text-center py-5 text-xs text-slate-400 border-t border-slate-200 bg-white">
        © 2026 {settings?.instituteName || 'Gyansai Maths IIT Center'} &bull; Official Examination Command Portal
      </footer>
    </div>
  );
};
