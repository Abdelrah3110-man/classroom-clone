import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { mockClassrooms } from '../data/mockData'

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
      const res = await axios.post('/api/v1/posts', { classroom_id: id, content: newPost });
      setClassroom({ ...classroom, posts: [res.data, ...(classroom.posts || [])] });
      setNewPost('');
    } catch (err) {
      alert("Failed to post.");
    } finally {
      setIsPosting(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-5 text-text-secondary">
      <div className="w-12 h-12 bg-primary rounded-full animate-ping opacity-75"></div>
      <p>Synchronizing classroom data...</p>
    </div>
  );

  // Fallback to mock data if API classroom not found or empty
  const displayClassroom = classroom || mockClassrooms.find(c => c.id === parseInt(id)) || mockClassrooms[0];

  if (!displayClassroom) return <div className="p-20 text-center">Classroom not found. Return to <Link to="/" className="text-primary hover:underline">Home</Link></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 animate-fade-in">
      {/* Header Banner */}
      <div className="h-[280px] rounded-2xl mt-6 relative overflow-hidden text-white flex items-end p-8" style={{ backgroundColor: displayClassroom.banner_color || '#4285f4' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="relative z-10 flex-grow">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{displayClassroom.name}</h1>
          <div className="flex items-center gap-3 text-lg opacity-90">
            <span>{displayClassroom.section}</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span>Room: {displayClassroom.room || 'General'}</span>
          </div>
          <div className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-md px-4 py-2 rounded-tl-xl text-sm border-l border-t border-white/10">
            Code: <strong>{displayClassroom.code}</strong>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white mt-4 rounded-xl border border-border sticky top-20 z-10 glass shadow-sm overflow-x-auto">
        <div className="flex justify-center min-w-max md:min-w-0">
          {['stream', 'classwork', 'people'].map(tab => (
            <button 
              key={tab}
              className={`px-8 py-4 font-bold transition-all relative ${activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-primary hover:bg-black/5'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary rounded-t-full"></div>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mt-6">
        <div className="space-y-6">
          {activeTab === 'stream' && (
            <>
              <div className="card-premium p-4 glass">
                <div className="flex gap-4">
                  <div className="avatar-circle">{displayClassroom.user?.name?.[0] || 'A'}</div>
                  <textarea 
                    placeholder="Share something with your class..."
                    className="flex-grow border-none outline-none bg-transparent resize-none pt-2 text-[15px] min-h-[48px]"
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                  />
                </div>
                {newPost && (
                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-border">
                    <button className="px-4 py-2 text-text-secondary font-medium hover:bg-black/5 rounded-lg" onClick={() => setNewPost('')}>Cancel</button>
                    <button className="px-5 py-2 bg-primary text-white rounded-lg font-bold shadow-md hover:bg-primary-hover disabled:opacity-50" onClick={handleCreatePost} disabled={isPosting}>
                      {isPosting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {displayClassroom.posts?.length > 0 ? (
                  displayClassroom.posts.map(post => (
                    <div key={post.id} className="card-premium p-5 animate-fade-in">
                      <div className="flex gap-3 mb-4">
                        <div className="avatar-circle w-9 h-9 text-xs">{post.user?.name?.[0]}</div>
                        <div>
                          <span className="block font-bold text-sm">{post.user?.name}</span>
                          <span className="text-[11px] text-text-secondary">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-[15px] leading-relaxed text-text-main mb-5">{post.content}</div>
                      <div className="pt-4 border-t border-border">
                        <input type="text" placeholder="Add class comment..." className="w-full px-4 py-2.5 rounded-full bg-bg border border-transparent focus:bg-white focus:border-primary focus:outline-none text-xs transition-all" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card-premium p-12 text-center text-text-secondary">
                    <div className="text-4xl mb-4">📢</div>
                    <h3 className="text-lg font-bold text-text-main">No announcements yet</h3>
                    <p className="text-sm">Be the first to share something with your students!</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'classwork' && (
            <div className="space-y-4">
               <h2 className="text-xl font-bold text-text-main mb-6">Assignments & Materials</h2>
               {(displayClassroom.assignments?.length > 0 || displayClassroom.materials?.length > 0) ? (
                 <div className="space-y-3">
                    {displayClassroom.assignments?.map(item => (
                      <div key={item.id} className="card-premium p-4 flex items-center gap-4 hover:bg-bg/50">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center text-lg">📝</div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-text-main">{item.title}</h4>
                          <span className="text-xs text-text-secondary">Posted {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs font-medium text-text-secondary">Due {new Date(item.due_date).toLocaleDateString()}</div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="p-12 text-center text-text-secondary card-premium">
                    <h3 className="font-bold text-text-main">Your class is empty</h3>
                    <p className="text-sm mt-1">Add assignments to help your students track their progress.</p>
                 </div>
               )}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card-premium p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Upcoming</h4>
            <p className="text-sm">No work due soon</p>
            <Link to="#" className="block text-xs font-bold text-primary hover:underline">View all</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ClassDetails
