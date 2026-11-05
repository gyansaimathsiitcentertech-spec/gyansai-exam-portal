import React from 'react';
import { usePortal } from '../../context/PortalContext';
import {
  LayoutGrid,
  Users,
  GraduationCap,
  Layers,
  HelpCircle,
  FileText,
  CalendarCheck,
  BookOpen,
  Bell,
  BarChart3,
  CheckSquare,
  CreditCard,
  BookMarked,
  Award,
  Settings,
  User,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    portalMode,
    setPortalMode,
    activeAdminTab,
    setActiveAdminTab,
    activeStudentTab,
    setActiveStudentTab,
    currentUser,
    logoutAdmin,
    requestAdminAccess,
    isAdminAuthenticated
  } = usePortal();

  // Admin Items matching Screenshot 466 & 487
  const adminItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'Students', label: 'Students', icon: Users },
    { id: 'Teachers', label: 'Teachers', icon: GraduationCap },
    { id: 'Batches', label: 'Batches', icon: Layers },
    { id: 'Question Bank', label: 'Question Bank', icon: HelpCircle },
    { id: 'Exams', label: 'Exams', icon: FileText },
    { id: 'Attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'Study Material', label: 'Study Material', icon: BookOpen },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Results & Recording', label: 'Results & Recording', icon: BarChart3 },
    { id: 'Evaluation', label: 'Evaluation', icon: CheckSquare },
    { id: 'Payments', label: 'Payments', icon: CreditCard },
    { id: 'Courses', label: 'Courses', icon: BookMarked },
    { id: 'Test Series', label: 'Test Series', icon: Award },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  // Student Items matching Screenshot 480
  const studentItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'Exams', label: 'Exams', icon: FileText },
    { id: 'Courses', label: 'Courses', icon: BookMarked },
    { id: 'Test Series', label: 'Test Series', icon: Award },
    { id: 'My Purchases', label: 'My Purchases', icon: CreditCard },
    { id: 'Profile', label: 'Profile', icon: User },
  ];

  const currentItems = portalMode === 'admin' ? adminItems : studentItems;

  const isCurrentActive = (id: string) => {
    if (portalMode === 'admin') {
      if (id === 'Exams' && (activeAdminTab === 'Exams' || activeAdminTab === 'Exam Management')) return true;
      if (id === 'Settings' && (activeAdminTab === 'Settings' || activeAdminTab === 'Institute Settings')) return true;
      return activeAdminTab === id;
    }
    return activeStudentTab === id;
  };

  const handleItemClick = (id: string) => {
    if (portalMode === 'admin') {
      if (id === 'Exams') {
        setActiveAdminTab('Exam Management');
      } else if (id === 'Settings') {
        setActiveAdminTab('Institute Settings');
      } else {
        setActiveAdminTab(id);
      }
    } else {
      setActiveStudentTab(id);
    }
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 h-screen select-none sticky top-0">
      {/* Top Header Logo - Matches Screenshot 466 & 480 */}
      <div
        onClick={() => setPortalMode('landing')}
        className="p-4 flex items-center space-x-2.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition"
      >
        <div className="w-8 h-8 rounded bg-[#002FA7] flex items-center justify-center text-white shrink-0 shadow-2xs">
          <LayoutGrid className="w-4 h-4" />
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-bold text-gray-950 leading-tight">Gyansai</div>
          <div className="text-[10px] font-mono tracking-wider text-gray-400 uppercase leading-none mt-0.5">
            {portalMode === 'admin' ? 'ADMIN CONSOLE' : 'STUDENT PORTAL'}
          </div>
        </div>
      </div>

      {/* Nav Items List */}
      <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {currentItems.map(item => {
          const active = isCurrentActive(item.id);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs font-medium transition cursor-pointer text-left ${
                active
                  ? 'bg-[#002FA7] text-white font-semibold shadow-2xs'
                  : 'text-gray-800 hover:bg-gray-100/70 hover:text-gray-950'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom User & Sign Out section */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-600 truncate font-mono mb-1">
          {portalMode === 'admin' ? 'admin@gyansaimaths.com' : (currentUser?.email || currentUser?.name || 'student')}
        </div>
        <button
          type="button"
          onClick={() => {
            if (portalMode === 'admin') {
              logoutAdmin();
            } else {
              setPortalMode('landing');
            }
          }}
          className="text-xs text-gray-800 hover:text-red-600 flex items-center space-x-1.5 font-medium cursor-pointer transition"
        >
          <LogOut className="w-3.5 h-3.5 text-gray-500" />
          <span>Sign Out</span>
        </button>

        {/* Quick portal role switcher */}
        <div className="mt-2.5 pt-2 border-t border-dashed border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
          <span>Portal View:</span>
          <div className="space-x-1">
            <button
              type="button"
              onClick={requestAdminAccess}
              className={`px-1.5 py-0.5 rounded cursor-pointer font-medium ${
                portalMode === 'admin' ? 'bg-blue-100 text-[#002FA7] font-bold' : 'hover:text-gray-700'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setPortalMode('student')}
              className={`px-1.5 py-0.5 rounded cursor-pointer font-medium ${
                portalMode === 'student' ? 'bg-blue-100 text-[#002FA7] font-bold' : 'hover:text-gray-700'
              }`}
            >
              Student
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
