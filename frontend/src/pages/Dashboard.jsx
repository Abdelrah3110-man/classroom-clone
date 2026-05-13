import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import ClassCard from '../components/ClassCard'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); 
  const [newClass, setNewClass] = useState({ name: '', section: '', subject: '' });
  const [joinCode, setJoinCode] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchClassrooms();
    }
  }, [user]);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'join' || action === 'create') {
      setModalType(action);
      setShowModal(true);
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, navigate]);

  const fetchClassrooms = async () => {
    try {
      const res = await api.get(`/classrooms?user_id=${user?.id}`);
      setClassrooms(res.data);
    } catch (err) {
      // Dashboard error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newClass, user_id: user?.id };
      const res = await api.post('/classrooms', payload);
      setClassrooms([res.data, ...classrooms]);
      setShowModal(false);
      setNewClass({ name: '', section: '', subject: '' });
      showToast("Class created successfully!", "success");
    } catch (err) {
      showToast("Failed to create class: " + err.message, "error");
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      const res = await api.post('/classrooms/join', { code: joinCode, user_id: user?.id });
      setClassrooms([res.data.classroom, ...classrooms.filter(c => c.id !== res.data.classroom.id)]);
      setShowModal(false);
      setJoinCode('');
      showToast("Successfully joined class!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to join class. Check code.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-text-secondary animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="font-medium tracking-wide">Synchronizing your dashboard...</p>
      </div>
    );
  }

  const teachingClasses = classrooms.filter(c => String(c.teacher_id) === String(user?.id));
  const enrolledClasses = classrooms.filter(c => c.students?.some(s => String(s.id) === String(user?.id)) && String(c.teacher_id) !== String(user?.id));
  
  const totalAssignments = classrooms.reduce((acc, curr) => acc + (curr.assignments?.length || 0), 0);
  const totalSubmissions = classrooms.reduce((acc, curr) => {
    const classSubmissions = curr.assignments?.reduce((a, c) => a + (c.submissions?.length || 0), 0) || 0;
    return acc + classSubmissions;
  }, 0);

  const selectedClass = classrooms.find(c => `class-${c.id}` === selectedClassId);

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main tracking-tight flex items-center gap-3">
             <span className="text-primary">FCI</span> Dashboard
          </h1>
          <p className="text-text-secondary mt-2 text-lg italic">
            Welcome back, <span className="text-primary font-bold not-italic">{user?.name}</span>
          </p>
        </div>
        
        {classrooms.length > 0 && (
          <div className="flex flex-wrap gap-4">
            <button 
              className="btn-secondary flex items-center gap-2 group"
              onClick={() => { setModalType('join'); setShowModal(true); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-12 transition-transform"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
              Join Class
            </button>
            <button 
              className="btn-primary flex items-center gap-2 group"
              onClick={() => { setModalType('create'); setShowModal(true); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create Class
            </button>
          </div>
        )}
      </header>

      {classrooms.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-slide-up">
          <div className="relative mb-10 w-64 h-64 mx-auto">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-150 animate-pulse"></div>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full drop-shadow-2xl">
              <path fill="#6366F1" d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.6,-31.3,87,-15.7,85.6,-0.8C84.2,14.1,78.1,28.2,69.4,40.1C60.7,52,49.5,61.7,36.8,68.9C24.1,76.1,10,80.7,-4.1,87.7C-18.1,94.7,-32.2,104.1,-44.1,101.4C-56,98.7,-65.7,83.9,-73.2,69.5C-80.7,55.1,-86,41.1,-88.7,26.7C-91.4,12.3,-91.5,-2.5,-87.3,-15.9C-83.1,-29.3,-74.6,-41.3,-64,-50.3C-53.4,-59.3,-40.7,-65.3,-28.4,-73.1C-16.1,-80.9,-4.1,-90.5,10,-90.5C24.1,-90.5,31.3,-83.6,44.7,-76.4Z" transform="translate(100 100)" opacity="0.1" />
              <rect x="60" y="60" width="80" height="100" rx="10" fill="#6366F1" transform="rotate(-5 100 110)" />
              <rect x="65" y="65" width="70" height="90" rx="8" fill="white" transform="rotate(-5 100 110)" />
              <path d="M75 80 H125 M75 95 H125 M75 110 H105" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" transform="rotate(-5 100 110)" />
              <circle cx="140" cy="50" r="25" fill="#F472B6" />
              <path d="M130 50 L140 60 L155 45" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 140 L50 130 L60 140 L50 150 Z" fill="#FBBF24" />
            </svg>
          </div>
          
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-text-main mb-6 leading-tight">
              Ready to start your <span className="text-primary underline decoration-primary/30 underline-offset-8">learning journey?</span>
            </h2>
            <p className="text-xl text-text-secondary mb-10 leading-relaxed font-medium">
              You haven't joined or created any classes yet. Connect with your teachers or start your own workspace to get started!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => { setModalType('join'); setShowModal(true); }}
                className="w-full sm:w-auto px-10 py-5 bg-white text-primary border-2 border-primary/20 rounded-[2rem] font-black text-lg shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:bg-primary/5 hover:-translate-y-1 transition-all active:scale-95"
              >
                Join with Code
              </button>
              <div className="text-text-secondary font-black text-sm uppercase tracking-widest px-4">OR</div>
              <button 
                onClick={() => { setModalType('create'); setShowModal(true); }}
                className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95"
              >
                Create New Class
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
            <div className="glass p-6 rounded-3xl relative overflow-hidden group border-b-4 border-primary">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-4xl font-extrabold text-primary mb-1 relative z-10">{teachingClasses.length}</h3>
              <p className="text-sm font-bold text-text-secondary uppercase tracking-widest relative z-10">Teaching</p>
            </div>
            <div className="glass p-6 rounded-3xl relative overflow-hidden group border-b-4 border-green-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-4xl font-extrabold text-green-500 mb-1 relative z-10">{enrolledClasses.length}</h3>
              <p className="text-sm font-bold text-text-secondary uppercase tracking-widest relative z-10">Enrolled</p>
            </div>
            <div className="glass p-6 rounded-3xl relative overflow-hidden group border-b-4 border-yellow-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-4xl font-extrabold text-yellow-500 mb-1 relative z-10">{totalAssignments}</h3>
              <p className="text-sm font-bold text-text-secondary uppercase tracking-widest relative z-10">Total Tasks</p>
            </div>
            <div className="glass p-6 rounded-3xl relative overflow-hidden group border-b-4 border-pink-500">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
              <h3 className="text-4xl font-extrabold text-pink-500 mb-1 relative z-10">{totalSubmissions}</h3>
              <p className="text-sm font-bold text-text-secondary uppercase tracking-widest relative z-10">Submissions</p>
            </div>
          </div>

          {/* Workspace Selector */}
          <div className="glass p-8 mb-12 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <label className="text-lg font-bold text-text-main whitespace-nowrap flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter Workspace:
            </label>
            <select 
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full md:w-80 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary font-bold text-text-main shadow-sm transition-all cursor-pointer"
            >
              <option value="">All Classes Overview</option>
              <optgroup label="Classes You Teach">
                {teachingClasses.map(c => <option key={c.id} value={`class-${c.id}`}>{c.name}</option>)}
              </optgroup>
              <optgroup label="Classes You've Joined">
                {enrolledClasses.map(c => <option key={c.id} value={`class-${c.id}`}>{c.name}</option>)}
              </optgroup>
            </select>
          </div>

          {/* Categorized View */}
          {!selectedClassId ? (
            <div className="space-y-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
              
              {/* Teaching Section */}
              {teachingClasses.length > 0 && (
                <section>
                  <h2 className="text-2xl font-extrabold text-text-main mb-8 flex items-center gap-3">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Teaching
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {teachingClasses.map((classroom) => (
                      <ClassCard key={classroom.id} classroom={classroom} />
                    ))}
                  </div>
                </section>
              )}

              {/* Enrolled Section */}
              {enrolledClasses.length > 0 && (
                <section>
                  <h2 className="text-2xl font-extrabold text-text-main mb-8 flex items-center gap-3">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    Enrolled
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {enrolledClasses.map((classroom) => (
                      <ClassCard key={classroom.id} classroom={classroom} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="animate-fade-in">
              {selectedClass && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                  <div className="space-y-6">
                    <div className="glass p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${selectedClass.banner_color || '#6366f1'} 0%, transparent 100%)`}}></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                           <span className={`px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest text-white shadow-sm ${String(user?.id) === String(selectedClass.teacher_id) ? 'bg-primary' : 'bg-green-500'}`}>
                              {String(user?.id) === String(selectedClass.teacher_id) ? 'Teaching' : 'Enrolled'}
                           </span>
                           <span className="bg-slate-100 text-slate-500 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest">
                              {selectedClass.section}
                           </span>
                        </div>
                        <h2 className="text-5xl font-extrabold text-text-main mb-2 tracking-tight">{selectedClass.name}</h2>
                        <p className="text-text-secondary font-bold text-lg">{selectedClass.subject}</p>
                      </div>
                      <Link 
                        to={`/class/${selectedClass.id}`}
                        className="btn-primary whitespace-nowrap relative z-10 text-xl px-10 py-4 shadow-xl"
                      >
                        Enter Workspace
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="glass p-8 rounded-[2rem] text-center shadow-sm hover:-translate-y-2 transition-all duration-300 border-b-4 border-primary">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">👥</div>
                        <h4 className="text-3xl font-extrabold text-text-main">{selectedClass.students?.length || 0}</h4>
                        <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] mt-2">Active Students</p>
                      </div>
                      <div className="glass p-8 rounded-[2rem] text-center shadow-sm hover:-translate-y-2 transition-all duration-300 border-b-4 border-green-500">
                        <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">📝</div>
                        <h4 className="text-3xl font-extrabold text-text-main">{selectedClass.assignments?.length || 0}</h4>
                        <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] mt-2">Tasks Posted</p>
                      </div>
                      <div className="glass p-8 rounded-[2rem] text-center shadow-sm hover:-translate-y-2 transition-all duration-300 border-b-4 border-yellow-500">
                        <div className="w-14 h-14 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
                        <h4 className="text-3xl font-extrabold text-text-main">
                          {selectedClass.assignments?.reduce((a, c) => a + (c.submissions?.length || 0), 0) || 0}
                        </h4>
                        <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] mt-2">Total Hand-ins</p>
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-6">
                    <div className="glass p-8 rounded-[2rem]">
                      <h4 className="font-extrabold text-text-main mb-8 flex items-center gap-3 text-lg">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        Recent Tasks
                      </h4>
                      {selectedClass.assignments?.length > 0 ? (
                        <div className="space-y-4">
                          {selectedClass.assignments.slice(0, 5).map(a => (
                            <Link to={`/class/${selectedClass.id}/assignments/${a.id}`} key={a.id} className="block p-5 rounded-2xl bg-white/50 hover:bg-white transition-all border border-slate-100 shadow-sm hover:shadow-lg group">
                              <p className="font-extrabold text-sm text-text-main truncate group-hover:text-primary transition-colors">{a.title}</p>
                              <div className="flex items-center gap-2 mt-2">
                                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                 <p className="text-[11px] text-text-secondary font-bold uppercase tracking-wider">Due {new Date(a.due_date).toLocaleDateString()}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center">
                          <p className="text-sm text-text-secondary font-medium italic">No assignments listed yet.</p>
                        </div>
                      )}
                    </div>
                  </aside>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[99999] p-4 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md glass rounded-[2rem] shadow-2xl p-10 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
              <h2 className="text-3xl font-extrabold text-text-main">{modalType === 'create' ? 'Create Class' : 'Join Class'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-text-secondary hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded-full transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            {modalType === 'create' ? (
              <form onSubmit={handleCreateClass} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Class Name</label>
                  <input 
                    type="text" required 
                    className="input-google"
                    value={newClass.name}
                    onChange={e => setNewClass({...newClass, name: e.target.value})}
                    placeholder="e.g. Physics 101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Section</label>
                  <input 
                    type="text" 
                    className="input-google"
                    value={newClass.section}
                    onChange={e => setNewClass({...newClass, section: e.target.value})}
                    placeholder="e.g. Semester 2"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Workspace</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleJoinClass} className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6">
                  <p className="text-sm font-medium text-primary">Enter the unique code provided by your teacher to access the classroom.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Class Code</label>
                  <input 
                    type="text" 
                    required
                    className="input-google text-center tracking-[0.5em] text-2xl font-mono uppercase"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value)}
                    placeholder="XYZ123"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Join Workspace</button>
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
