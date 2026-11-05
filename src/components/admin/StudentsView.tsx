import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Upload, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { User } from '../../types';

export const StudentsView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, showToast } = usePortal();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);

  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newClass, setNewClass] = useState('11th');
  const [newEmail, setNewEmail] = useState('');

  // Get all students from real PortalContext users
  const studentList = users.filter(u => u.role === 'student');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addUser({
      name: newName.trim(),
      username: newUsername.trim() || `g${Date.now().toString().slice(-9)}`,
      email: newEmail.trim() || `${newName.trim().toLowerCase().replace(/\s+/g, '')}@student.gyansai.in`,
      role: 'student',
      targetExam: `${newClass} IIT-JEE / MHT-CET`,
      rollNo: `GMI-${newClass.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      batchName: `${newClass} Standard Batch`
    });

    setModalOpen(false);
    setNewName('');
    setNewUsername('');
    setNewEmail('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateUser(editingStudent.id, {
      name: editingStudent.name,
      username: editingStudent.username,
      email: editingStudent.email,
      targetExam: editingStudent.targetExam
    });
    setEditingStudent(null);
  };

  const handleDelete = (student: User) => {
    deleteUser(student.id);
  };

  const filtered = studentList.filter(s => {
    const textMatch =
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (s.username && s.username.toLowerCase().includes(searchText.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(searchText.toLowerCase())) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(searchText.toLowerCase()));
    return textMatch;
  });

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Top Header - Exact Screenshot 467 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-medium tracking-widest text-gray-400 uppercase mb-1">
            // ROSTER
          </div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Student Management
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            {studentList.length} students enrolled
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => showToast('Importing students spreadsheet (xlsx)...')}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>Bulk Import (xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewName('');
              setNewUsername('');
              setNewClass('11th');
              setNewEmail('');
              setModalOpen(true);
            }}
            className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold text-xs flex items-center space-x-1 cursor-pointer shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter Bar - Exact Screenshot 467 */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex-1 max-w-sm flex items-center space-x-2">
          <label className="text-gray-500 text-[11px]">Search</label>
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Name, username, roll number, email..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs text-gray-900 bg-white focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-gray-500 text-[11px]">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-800 text-xs focus:outline-none focus:border-blue-600"
          >
            <option value="All">All</option>
            <option value="active">Active</option>
          </select>
          <button
            type="button"
            onClick={() => showToast('Student filters applied.')}
            className="px-4 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table - Exact Screenshot 467 */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-mono text-xs">
              No students found. Click &quot;Add Student&quot; to enroll.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-5 py-3">NAME</th>
                  <th className="px-5 py-3">USERNAME</th>
                  <th className="px-5 py-3">CLASS</th>
                  <th className="px-5 py-3">EMAIL</th>
                  <th className="px-5 py-3">ENROLLMENT / ROLL</th>
                  <th className="px-5 py-3">STATUS</th>
                  <th className="px-5 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50/60 transition group">
                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-gray-600">
                      {student.username || `g${student.id.slice(-8)}`}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-gray-600">
                      {student.targetExam ? student.targetExam.split(' ')[0] : '11th'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-gray-400">
                      {student.rollNo || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-3 py-0.5 bg-[#002FA7] text-white font-mono text-[10px] font-bold rounded">
                        active
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingStudent({ ...student })}
                          className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
                          title="Edit student record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(student)}
                          className="text-red-400 hover:text-red-600 cursor-pointer p-1"
                          title="Delete student and all exam attempts"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Add New Student</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Patil"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. g0370741843"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-mono text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    value={newClass}
                    onChange={e => setNewClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white text-gray-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                    <option value="Repeater">Repeater</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold cursor-pointer"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900">Edit Student Record</h3>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editingStudent.username || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-mono text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingStudent.email}
                  onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Exam
                </label>
                <input
                  type="text"
                  value={editingStudent.targetExam || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, targetExam: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs text-gray-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#002FA7] hover:bg-blue-800 text-white rounded font-semibold cursor-pointer"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
