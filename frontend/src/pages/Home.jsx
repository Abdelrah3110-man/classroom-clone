import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ClassCard from '../components/ClassCard'
import { mockClassrooms } from '../data/mockData'

const Home = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' or 'join'
  const [newClass, setNewClass] = useState({ name: '', section: '', subject: '' });
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await axios.get('/api/v1/classrooms');
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
      const res = await axios.post('/api/v1/classrooms', newClass);
      setClassrooms([res.data, ...classrooms]);
      setShowModal(false);
      setNewClass({ name: '', section: '', subject: '' });
    } catch (err) {
      alert("Failed to create class.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-text-secondary">
        <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
        <p>Preparing your classroom experience...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Learning Dashboard</h1>
          <p className="text-text-secondary mt-1 text-lg">Organize, teach, and learn efficiently.</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 border border-border bg-white text-text-main px-6 py-3 rounded-full font-bold hover:bg-bg transition-all"
            onClick={() => { setModalType('join'); setShowModal(true); }}
          >
            Join Class
          </button>
          <button 
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-primary-hover hover:-translate-y-0.5 transition-all active:scale-95"
            onClick={() => { setModalType('create'); setShowModal(true); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create Class
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(classrooms.length > 0 ? classrooms : mockClassrooms).map(classroom => (
          <ClassCard key={classroom.id} classroom={classroom} />
        ))}
      </div>

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
                    className="input-google"
                    value={newClass.name}
                    onChange={e => setNewClass({...newClass, name: e.target.value})}
                    placeholder="e.g. Physics 101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Section</label>
                  <input 
                    type="text" 
                    className="input-google"
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
              <div className="space-y-5">
                <p className="text-sm text-text-secondary">Ask your teacher for the class code, then enter it here.</p>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Class Code</label>
                  <input 
                    type="text" 
                    className="input-google"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value)}
                    placeholder="e.g. WEB777"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" className="px-5 py-2 text-text-secondary font-medium hover:bg-black/5 rounded-lg transition-all" onClick={() => setShowModal(false)}>Cancel</button>
                  <button 
                    className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-md transition-all"
                    onClick={() => { alert("Successfully joined!"); setShowModal(false); }}
                  >
                    Join
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
