import React from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  GraduationCap,
  Clock,
  FileText,
  Shield,
  UserPlus,
  LogIn
} from 'lucide-react';

export const SharedExamLanding: React.FC = () => {
  const {
    exams,
    activeExamIdForShare,
    setPortalMode,
    setQuickJoinModalOpen,
    setAuthModalOpen,
    setAuthModalTab
  } = usePortal();

  const currentExam = exams.find(e => e.id === activeExamIdForShare) || exams[0];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans flex flex-col justify-between selection:bg-blue-100">
      {/* Top Bar - Exact replica of Screenshot 488 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div
          onClick={() => setPortalMode('landing')}
          className="flex items-center space-x-2 text-slate-900 font-semibold cursor-pointer select-none"
        >
          <GraduationCap className="w-5 h-5 text-blue-700" />
          <span className="text-sm font-bold tracking-tight">Gyansai</span>
        </div>

        <div className="text-xs font-mono font-medium text-gray-500 uppercase tracking-widest">
          // SHARED EXAM
        </div>
      </header>

      {/* Main Container - Exact replica of Screenshot 488 */}
      <main className="max-w-4xl w-full mx-auto p-6 my-auto space-y-6">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-2">
            // YOU'RE INVITED TO ATTEMPT
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            {currentExam?.title || 'addi'}
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-mono">
            Exam folder: {currentExam?.folderName || 'addi'} ({currentExam?.questions?.length || 0} questions)
          </p>

          <div className="flex items-center space-x-2 mt-3">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs font-semibold">
              {currentExam?.targetClass || '11th'}
            </span>
            <span className="px-2.5 py-0.5 bg-[#002FA7] text-white rounded text-xs font-semibold">
              {currentExam?.examCategory || 'JEE Mains'}
            </span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 border border-gray-200 rounded-sm">
            <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase mb-2">
              DURATION
            </div>
            <div className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{currentExam?.durationMinutes || 60} min</span>
            </div>
          </div>

          <div className="bg-white p-5 border border-gray-200 rounded-sm">
            <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase mb-2">
              QUESTIONS
            </div>
            <div className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span>{currentExam?.questions?.length || 0}</span>
            </div>
          </div>

          <div className="bg-white p-5 border border-gray-200 rounded-sm">
            <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase mb-2">
              PASS MARKS
            </div>
            <div className="text-lg font-bold text-gray-900">
              —
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white p-6 border border-gray-200 rounded-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
            <Shield className="w-4 h-4 text-blue-700" />
            <span>Instructions</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {currentExam?.instructions?.[0] || 'Read each question carefully. Marks: +4 correct, -1 wrong.'}
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setQuickJoinModalOpen(true)}
            className="py-3 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded flex items-center justify-center space-x-2 cursor-pointer shadow-2xs transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Quick Join</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setAuthModalOpen(true);
            }}
            className="py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded flex items-center justify-center space-x-2 cursor-pointer transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalTab('signup');
              setAuthModalOpen(true);
            }}
            className="py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded flex items-center justify-center space-x-2 cursor-pointer transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Helper Footnote */}
        <div className="text-[11px] text-gray-500 space-y-1.5 pt-2 leading-relaxed">
          <p>
            Quick Join: instant guest account with auto-set password (great for one-time exams). Log In / Sign Up: full Gyansai account (tracked progress, certificates, parent reports).
          </p>
          <p>
            By joining you agree to webcam & microphone monitoring during the exam.
          </p>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="text-center py-4 text-xs text-gray-400">
        © 2026 Gyansai Maths IIT Center
      </footer>
    </div>
  );
};
