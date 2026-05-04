import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ClassCard from '../components/ClassCard'

const Home = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', section: '', subject: '' });

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
      alert("Failed to create class. Make sure the backend is running.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Preparing your classroom experience...</p>
      </div>
    );
  }

  return (
    <div className="home-page animate-fade-in">
      <header className="home-header">
        <div className="header-text">
          <h1>Learning Dashboard</h1>
          <p>Organize, teach, and learn efficiently.</p>
        </div>
        <button className="create-btn" onClick={() => setShowModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create Class
        </button>
      </header>

      <div className="class-grid">
        {classrooms.map(classroom => (
          <ClassCard key={classroom.id} classroom={classroom} />
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass" onClick={e => e.stopPropagation()}>
            <h2>Create New Class</h2>
            <form onSubmit={handleCreateClass}>
              <div className="form-group">
                <label>Class Name (required)</label>
                <input 
                  type="text" 
                  required 
                  value={newClass.name}
                  onChange={e => setNewClass({...newClass, name: e.target.value})}
                  placeholder="e.g. Physics 101"
                />
              </div>
              <div className="form-group">
                <label>Section</label>
                <input 
                  type="text" 
                  value={newClass.section}
                  onChange={e => setNewClass({...newClass, section: e.target.value})}
                  placeholder="e.g. Semester 2"
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  value={newClass.subject}
                  onChange={e => setNewClass({...newClass, subject: e.target.value})}
                  placeholder="e.g. Science"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .home-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 48px 0 24px;
        }
        .header-text h1 { font-size: 32px; font-weight: 700; color: var(--text-main); }
        .header-text p { color: var(--text-secondary); margin-top: 4px; font-size: 16px; }
        
        .create-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--primary);
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(66, 133, 244, 0.39);
          transition: var(--transition);
        }
        .create-btn:hover { background: var(--primary-hover); transform: translateY(-2px); }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          width: 100%;
          max-width: 450px;
          padding: 32px;
          border-radius: 20px;
          background: white;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        }
        .modal-content h2 { margin-bottom: 24px; font-size: 24px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-secondary); }
        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 15px;
          transition: border-color 0.2s;
        }
        .form-group input:focus { border-color: var(--primary); outline: none; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }
        .modal-actions button { padding: 10px 20px; border-radius: 8px; font-weight: 500; }
        .submit-btn { background: var(--primary); color: white; }
      `}</style>
    </div>
  )
}

export default Home
