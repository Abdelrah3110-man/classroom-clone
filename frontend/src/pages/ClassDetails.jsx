import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ClassDetails = () => {
  const { id } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await axios.get(`/api/v1/classrooms/${id}`);
        setClassroom(res.data);
      } catch (err) {
        console.error("Error fetching classroom:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!classroom) return <div className="error">Classroom not found</div>;

  return (
    <div className="class-details animate-fade-in">
      <div className="class-banner" style={{ backgroundColor: classroom.banner_color || '#4285f4' }}>
        <div className="banner-content">
          <h1>{classroom.name}</h1>
          <p>{classroom.section}</p>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'stream' ? 'active' : ''}`}
          onClick={() => setActiveTab('stream')}
        >
          Stream
        </button>
        <button 
          className={`tab ${activeTab === 'classwork' ? 'active' : ''}`}
          onClick={() => setActiveTab('classwork')}
        >
          Classwork
        </button>
        <button 
          className={`tab ${activeTab === 'people' ? 'active' : ''}`}
          onClick={() => setActiveTab('people')}
        >
          People
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'stream' && (
          <div className="stream-view">
            <div className="announcement-box glass">
              <div className="avatar">A</div>
              <input type="text" placeholder="Announce something to your class" />
            </div>
            
            {classroom.posts?.map(post => (
              <div key={post.id} className="post-card card">
                <div className="post-header">
                  <div className="avatar">{post.user?.name?.[0]}</div>
                  <div className="post-info">
                    <div className="post-author">{post.user?.name}</div>
                    <div className="post-date">{new Date(post.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="post-content">{post.content}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'classwork' && (
          <div className="classwork-view">
             <div className="work-header">
                <h2>Assignments & Materials</h2>
             </div>
             {classroom.assignments?.length > 0 ? (
               classroom.assignments.map(assign => (
                 <div key={assign.id} className="work-item card">
                    <div className="work-icon assignment">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div className="work-title">{assign.title}</div>
                    <div className="work-date">Due {new Date(assign.due_date).toLocaleDateString()}</div>
                 </div>
               ))
             ) : (
               <p className="empty-msg">No assignments yet.</p>
             )}
          </div>
        )}
      </div>

      <style>{`
        .class-banner {
          height: 240px;
          border-radius: var(--radius);
          margin-top: 24px;
          display: flex;
          align-items: flex-end;
          padding: 24px;
          color: white;
          background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.3));
        }
        .banner-content h1 { font-size: 36px; font-weight: 500; }
        .banner-content p { font-size: 18px; opacity: 0.9; }

        .tabs {
          display: flex;
          justify-content: center;
          gap: 32px;
          border-bottom: 1px solid var(--border);
          margin-top: 16px;
        }
        .tab {
          padding: 16px 24px;
          font-weight: 500;
          color: var(--text-secondary);
          position: relative;
          transition: var(--transition);
        }
        .tab:hover { color: var(--primary); background: rgba(66, 133, 244, 0.05); }
        .tab.active { color: var(--primary); }
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background-color: var(--primary);
          border-radius: 3px 3px 0 0;
        }

        .tab-content { padding: 32px 0; max-width: 800px; margin: 0 auto; }
        
        .announcement-box {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          margin-bottom: 24px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .announcement-box input {
          flex-grow: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
        }

        .post-card { margin-bottom: 16px; padding: 20px; }
        .post-header { display: flex; gap: 12px; margin-bottom: 12px; }
        .post-author { font-weight: 500; font-size: 14px; }
        .post-date { font-size: 12px; color: var(--text-secondary); }
        .post-content { font-size: 15px; color: var(--text-main); line-height: 1.6; }

        .work-item {
          display: flex;
          align-items: center;
          padding: 16px;
          margin-bottom: 8px;
          gap: 16px;
        }
        .work-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e8f0fe;
          color: var(--primary);
        }
        .work-title { flex-grow: 1; font-weight: 500; }
        .work-date { font-size: 13px; color: var(--text-secondary); }
        
        .empty-msg { text-align: center; padding: 48px; color: var(--text-secondary); }
      `}</style>
    </div>
  )
}

export default ClassDetails
