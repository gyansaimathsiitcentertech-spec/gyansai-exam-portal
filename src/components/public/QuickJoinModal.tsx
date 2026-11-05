import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { UserPlus, X, ArrowRight } from 'lucide-react';

export const QuickJoinModal: React.FC = () => {
  const {
    quickJoinModalOpen,
    setQuickJoinModalOpen,
    exams,
    activeExamIdForShare,
    quickJoinAndStartExam
  } = usePortal();

  const currentExam = exams.find(e => e.id === activeExamIdForShare) || exams[0];

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [email, setEmail] = useState('');
  const [targetClass, setTargetClass] = useState('11th');
  const [password, setPassword] = useState('');

  if (!quickJoinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) return;

    quickJoinAndStartExam(
      fullName.trim(),
      mobile.trim(),
      email.trim() || `${mobile.trim()}@guest.gyansai.com`,
      `Class ${targetClass}`,
      currentExam ? currentExam.id : exams[0]?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header - Exact Screenshot 489 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm">
            <UserPlus className="w-4 h-4 text-blue-700" />
            <span>Quick Join</span>
          </div>
          <button
            type="button"
            onClick={() => setQuickJoinModalOpen(false)}
            className="text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Exact Screenshot 489 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-blue-600 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Mobile *
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Parent Mobile
              </label>
              <input
                type="tel"
                value={parentMobile}
                onChange={e => setParentMobile(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Class
              </label>
              <select
                value={targetClass}
                onChange={e => setTargetClass(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
              >
                <option value="11th">11th</option>
                <option value="12th">12th</option>
                <option value="Repeater / Dropper">Repeater / Dropper</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Password (optional)
              </label>
              <input
                type="text"
                placeholder="auto-set"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <p className="text-[11px] text-gray-500 pt-1 leading-normal">
            If you leave password empty, we generate one and show it after joining. Save it to log back in later.
          </p>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#002FA7] hover:bg-blue-800 text-white font-semibold text-xs rounded flex items-center space-x-1.5 cursor-pointer shadow-xs transition"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Join & Start</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
