import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import ClassCard from '../components/ClassCard'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); 
  const [newClass, setNewClass] = useState({ name: '', section: '', subject: '' });
  const [joinCode, setJoinCode] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await api.get('/classrooms');
      setClassrooms(res.data);
    } catch (err) {
      console.error("Error fetching classrooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/classrooms', newClass);
      setClassrooms([res.data, ...classrooms]);
      setShowModal(false);
      setNewClass({ name: '', section: '', subject: '' });
    } catch (err) {
      alert("Failed to create class. Error: " + err.message);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      const res = await api.post('/classrooms/join', { code: joinCode });
      setClassrooms([res.data.classroom, ...classrooms.filter(c => c.id !== res.data.classroom.id)]);
      setShowModal(false);
      setJoinCode('');
      alert("Successfully joined class!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join class. Check code.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-text-secondary">
        <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
        <p>Synchronizing your dashboard...</p>
      </div>
    );
  }

  // Calculate Stats
  const totalClasses = classrooms.length;
  const totalAssignments = classrooms.reduce((acc, curr) => acc + (curr.assignments?.length || 0), 0);
  const totalSubmissions = classrooms.reduce((acc, curr) => {
    const classSubmissions = curr.assignments?.reduce((a, c) => a + (c.submissions?.length || 0), 0) || 0;
    return acc + classSubmissions;
  }, 0);
  const totalStudents = classrooms.reduce((acc, curr) => acc + (curr.students?.length || 0), 0);

  const selectedClass = classrooms.find(c => `class-${c.id}` === selectedClassId);

  return (
    <div className="container mx-auto px-6 py-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Global Dashboard</h1>
          <p className="text-text-secondary mt-1">Overview of all your classrooms and activities</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 border border-border bg-white text-text-main px-6 py-2.5 rounded-full font-bold hover:bg-bg transition-all"
            onClick={() => { setModalType('join'); setShowModal(true); }}
          >
            Join Class
          </button>
          <button 
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-primary-hover hover:-translate-y-0.5 transition-all"
            onClick={() => { setModalType('create'); setShowModal(true); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Class
          </button>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card-premium p-6 border-l-4 border-primary">
          <h3 className="text-3xl font-bold text-primary mb-1">{totalClasses}</h3>
          <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Total Classes</p>
        </div>
        <div className="card-premium p-6 border-l-4 border-green-500">
          <h3 className="text-3xl font-bold text-green-500 mb-1">{totalAssignments}</h3>
          <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Assignments</p>
        </div>
        <div className="card-premium p-6 border-l-4 border-yellow-500">
          <h3 className="text-3xl font-bold text-yellow-500 mb-1">{totalSubmissions}</h3>
          <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Submissions</p>
        </div>
        <div className="card-premium p-6 border-l-4 border-red-500">
          <h3 className="text-3xl font-bold text-red-500 mb-1">{totalStudents}</h3>
          <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Total Students</p>
        </div>
      </div>

      {/* Class Selector Section */}
      <div className="card-premium p-6 mb-8 bg-bg/50">
        <label className="block text-sm font-bold text-text-main mb-3">Filter by Class</label>
        <select 
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-full md:w-64 p-3 bg-white rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/20 font-medium"
        >
          <option value="">All Classes Overview</option>
          {classrooms.map(c => (
            <option key={c.id} value={`class-${c.id}`}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Main View Area */}
      {!selectedClassId ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text-main">Classes Overview</h2>
          {classrooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {classrooms.map(classroom => (
                <ClassCard key={classroom.id} classroom={classroom} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
              <h3 className="text-xl font-bold text-text-main">No classes found</h3>
              <p className="text-text-secondary mt-2">Create your first class to see it here!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-fade-in">
          {selectedClass && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
              <div className="space-y-6">
                <div className="card-premium p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-text-main mb-2">{selectedClass.name}</h2>
                    <p className="text-text-secondary font-medium">{selectedClass.section} • {selectedClass.subject}</p>
                  </div>
                  <Link 
                    to={`/class/${selectedClass.id}`}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-hover transition-all"
                  >
                    Open Classroom
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-border text-center">
                    <h4 className="text-xl font-bold text-primary">{selectedClass.students?.length || 0}</h4>
                    <p className="text-xs text-text-secondary font-bold uppercase">Students</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-border text-center">
                    <h4 className="text-xl font-bold text-green-500">{selectedClass.assignments?.length || 0}</h4>
                    <p className="text-xs text-text-secondary font-bold uppercase">Assignments</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-border text-center">
                    <h4 className="text-xl font-bold text-yellow-500">
                      {selectedClass.assignments?.reduce((a, c) => a + (c.submissions?.length || 0), 0) || 0}
                    </h4>
                    <p className="text-xs text-text-secondary font-bold uppercase">Submissions</p>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="card-premium p-6">
                  <h4 className="font-bold text-text-main mb-4 border-b border-border pb-2">Recent Assignments</h4>
                  {selectedClass.assignments?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedClass.assignments.slice(0, 5).map(a => (
                        <Link to={`/class/${selectedClass.id}/assignments/${a.id}`} key={a.id} className="block p-3 rounded-lg hover:bg-bg transition-colors border border-transparent hover:border-border">
                          <p className="font-bold text-sm text-text-main">📚 {a.title}</p>
                          <p className="text-[10px] text-text-secondary mt-1">{new Date(a.created_at).toLocaleDateString()}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary italic">No assignments yet.</p>
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{modalType === 'create' ? 'Create New Class' : 'Join a Class'}</h2>
            
            {modalType === 'create' ? (
              <form onSubmit={handleCreateClass} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Class Name (required)</label>
                  <input 
                    type="text" required 
                    className="w-full p-3 bg-bg rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                    value={newClass.name}
                    onChange={e => setNewClass({...newClass, name: e.target.value})}
                    placeholder="e.g. Physics 101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Section</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-bg rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                    value={newClass.section}
                    onChange={e => setNewClass({...newClass, section: e.target.value})}
                    placeholder="e.g. Semester 2"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" className="px-5 py-2 text-text-secondary font-medium hover:bg-black/5 rounded-lg transition-all" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-md transition-all">Create</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleJoinClass} className="space-y-5">
                <p className="text-sm text-text-secondary">Ask your teacher for the class code, then enter it here.</p>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Class Code</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 bg-bg rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium text-center tracking-widest text-lg"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value)}
                    placeholder="e.g. WEB777"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" className="px-5 py-2 text-text-secondary font-medium hover:bg-black/5 rounded-lg transition-all" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-md transition-all">Join</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard;
