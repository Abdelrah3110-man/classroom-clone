import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ClassDetails = () => {
  const { id } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchClassroom();
  }, [id]);

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

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setIsPosting(true);
    try {
      const res = await axios.post('/api/v1/posts', {
        classroom_id: id,
        content: newPost
      });
      setClassroom({
        ...classroom,
        posts: [res.data, ...(classroom.posts || [])]
      });
      setNewPost('');
    } catch (err) {
      alert("Failed to post. Check connection.");
    } finally {
      setIsPosting(false);
    }
  };

  if (loading) return (
    <div className="loading-state">
      <div className="pulse-loader"></div>
      <p>Synchronizing classroom data...</p>
    </div>
  );

  if (!classroom) return <div className="error-state">Classroom not found. Return to <Link to="/">Home</Link></div>;

  return (
    <div className="class-details animate-fade-in">
      {/* Header Banner */}
      <div className="class-hero" style={{ backgroundColor: classroom.banner_color || '#4285f4' }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{classroom.name}</h1>
          <div className="hero-meta">
            <span>{classroom.section}</span>
            <span className="dot"></span>
            <span>Room: {classroom.room || 'General'}</span>
          </div>
          <div className="class-code-badge">
            Code: <strong>{classroom.code}</strong>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="class-nav glass">
        <div className="nav-container">
          {['stream', 'classwork', 'people'].map(tab => (
            <button 
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-layout container">
        {/* Main Content Area */}
        <div className="main-feed">
          {activeTab === 'stream' && (
            <>
              {/* Post Creation Box */}
              <div className="post-creator card glass">
                <div className="creator-row">
                  <div className="avatar">{classroom.user?.name?.[0] || 'A'}</div>
                  <textarea 
                    placeholder="Share something with your class..."
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                  />
                </div>
                {newPost && (
                  <div className="creator-actions">
                    <button className="cancel-btn" onClick={() => setNewPost('')}>Cancel</button>
                    <button className="post-btn" onClick={handleCreatePost} disabled={isPosting}>
                      {isPosting ? 'Posting...' : 'Post Announcement'}
                    </button>
                  </div>
                )}
              </div>

              {/* Feed Items */}
              <div className="feed-list">
                {classroom.posts?.length > 0 ? (
                  classroom.posts.map(post => (
                    <div key={post.id} className="feed-card card animate-fade-in">
                      <div className="feed-header">
                        <div className="avatar small">{post.user?.name?.[0]}</div>
                        <div className="feed-meta">
                          <span className="author-name">{post.user?.name}</span>
                          <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="feed-body">
                        {post.content}
                      </div>
                      <div className="feed-footer">
                        <input type="text" placeholder="Add class comment..." className="comment-input" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state card">
                    <div className="empty-icon">📢</div>
                    <h3>No announcements yet</h3>
                    <p>Be the first to share something with your students!</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'classwork' && (
            <div className="classwork-view">
               <div className="section-title">Assignments & Materials</div>
               {(classroom.assignments?.length > 0 || classroom.materials?.length > 0) ? (
                 <div className="work-list">
                    {classroom.assignments?.map(item => (
                      <div key={item.id} className="work-card card">
                        <div className="work-icon assignment">📝</div>
                        <div className="work-info">
                          <h4>{item.title}</h4>
                          <span>Posted {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="work-due">Due {new Date(item.due_date).toLocaleDateString()}</div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="empty-state">
                    <h3>Your class is empty</h3>
                    <p>Add assignments to help your students track their progress.</p>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="details-sidebar">
          <div className="sidebar-widget card">
            <h4>Upcoming</h4>
            <p>No work due soon</p>
            <Link to="#" className="widget-link">View all</Link>
          </div>
        </aside>
      </div>

      <style>{`
        .class-hero {
          height: 280px;
          border-radius: 16px;
          margin-top: 24px;
          position: relative;
          overflow: hidden;
          color: white;
          display: flex;
          align-items: flex-end;
          padding: 32px;
        }
        .hero-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);
        }
        .hero-content { position: relative; z-index: 1; flex-grow: 1; }
        .hero-content h1 { font-size: 42px; margin-bottom: 8px; font-weight: 700; }
        .hero-meta { display: flex; align-items: center; gap: 12px; font-size: 18px; opacity: 0.9; }
        .dot { width: 4px; height: 4px; border-radius: 50%; background: white; }
        .class-code-badge {
          position: absolute;
          bottom: 0; right: 0;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: 12px 0 0 0;
          font-size: 14px;
        }

        .class-nav {
          background: white;
          margin-top: 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          position: sticky;
          top: 80px;
          z-index: 10;
        }
        .nav-container { display: flex; justify-content: center; }
        .nav-tab {
          padding: 18px 32px;
          font-weight: 600;
          color: var(--text-secondary);
          position: relative;
          transition: 0.2s;
        }
        .nav-tab.active { color: var(--primary); }
        .nav-tab.active::after {
          content: ''; position: absolute; bottom: 0; left: 20%; right: 20%; height: 4px;
          background: var(--primary); border-radius: 4px 4px 0 0;
        }

        .tab-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 24px;
          margin-top: 24px;
          padding-bottom: 80px;
        }

        .post-creator { padding: 16px; margin-bottom: 24px; border: 1px solid var(--border); }
        .creator-row { display: flex; gap: 16px; }
        .creator-row textarea {
          flex-grow: 1; border: none; outline: none; background: transparent;
          resize: none; padding-top: 8px; font-size: 15px; min-height: 48px;
        }
        .creator-actions {
          display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .post-btn { background: var(--primary); color: white; padding: 8px 16px; border-radius: 8px; font-weight: 600; }
        .post-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .feed-card { padding: 20px; margin-bottom: 16px; border: 1px solid var(--border); }
        .feed-header { display: flex; gap: 12px; margin-bottom: 16px; }
        .author-name { display: block; font-weight: 600; font-size: 14px; }
        .post-time { font-size: 12px; color: var(--text-secondary); }
        .feed-body { font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: var(--text-main); }
        .comment-input {
          width: 100%; padding: 10px 16px; border-radius: 20px;
          background: #f8f9fa; border: 1px solid transparent; font-size: 13px;
        }
        .comment-input:focus { background: white; border-color: var(--primary); outline: none; }

        .details-sidebar h4 { font-size: 14px; margin-bottom: 12px; color: var(--text-main); }
        .sidebar-widget { padding: 16px; border: 1px solid var(--border); }
        .widget-link { display: block; margin-top: 16px; font-size: 13px; color: var(--primary); font-weight: 600; }

        .loading-state { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
        .pulse-loader { width: 48px; height: 48px; background: var(--primary); border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }
      `}</style>
    </div>
  )
}

export default ClassDetails
