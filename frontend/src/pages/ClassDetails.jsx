import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'

const ClassDetails = () => {
  const { id } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    fetchClassroom();
  }, [id]);

  const fetchClassroom = async () => {
    try {
      const res = await api.get(`/classrooms/${id}`);
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
      const res = await api.post('/posts', { classroom_id: id, content: newPost });
      setClassroom({ ...classroom, posts: [res.data, ...(classroom.posts || [])] });
      setNewPost('');
    } catch (err) {
      alert("Failed to post.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCreateComment = async (postId, e) => {
    e.preventDefault();
    const text = commentText[postId];
    if (!text?.trim()) return;
    
    try {
      const res = await api.post('/comments', { post_id: postId, content: text });
      
      const updatedPosts = classroom.posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...(p.comments || []), res.data] };
        }
        return p;
      });
      
      setClassroom({ ...classroom, posts: updatedPosts });
      setCommentText({ ...commentText, [postId]: '' });
    } catch (err) {
      console.error("Failed to post comment");
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-5 text-text-secondary">
      <div className="w-12 h-12 bg-primary rounded-full animate-ping opacity-75"></div>
      <p>Synchronizing classroom data...</p>
    </div>
  );

  if (!classroom) return (
    <div className="p-20 text-center bg-white m-10 rounded-2xl border border-border">
      <h2 className="text-2xl font-bold mb-4">Classroom not found</h2>
      <p className="mb-6 text-text-secondary">This classroom might have been deleted or doesn't exist in the database.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20 animate-fade-in">
      {/* Header Banner */}
      <div className="h-[280px] rounded-2xl mt-6 relative overflow-hidden text-white flex items-end p-8" style={{ backgroundColor: classroom.banner_color || '#4285f4' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="relative z-10 flex-grow">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{classroom.name}</h1>
          <div className="flex items-center gap-3 text-lg opacity-90">
            <span>{classroom.section}</span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span>Room: {classroom.room || 'General'}</span>
          </div>
          <div className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-md px-4 py-2 rounded-tl-xl text-sm border-l border-t border-white/10">
            Code: <strong>{classroom.code}</strong>
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
                  <div className="avatar-circle">{classroom.teacher?.name?.[0] || 'A'}</div>
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
                {classroom.posts?.length > 0 ? (
                  classroom.posts.map(post => (
                    <div key={post.id} className="card-premium p-5 animate-fade-in">
                      <div className="flex gap-3 mb-4">
                        <div className="avatar-circle w-9 h-9 text-xs">{post.user?.name?.[0]}</div>
                        <div>
                          <span className="block font-bold text-sm">{post.user?.name}</span>
                          <span className="text-[11px] text-text-secondary">{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-[15px] leading-relaxed text-text-main mb-5">
                        {post.description || post.content}
                      </div>
                      <div className="pt-4 border-t border-border">
                        {post.comments?.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {post.comments.map(comment => (
                              <div key={comment.id} className="flex gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-50 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                  {comment.user?.name?.[0]}
                                </div>
                                <div className="bg-bg rounded-2xl px-4 py-2 text-sm flex-grow">
                                  <span className="font-bold mr-2">{comment.user?.name}</span>
                                  <span className="text-text-main">{comment.content}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <form onSubmit={(e) => handleCreateComment(post.id, e)} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            placeholder="Add class comment..." 
                            className="flex-grow px-4 py-2.5 rounded-full bg-bg border border-transparent focus:bg-white focus:border-primary focus:outline-none text-xs transition-all" 
                            value={commentText[post.id] || ''}
                            onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})}
                          />
                          <button type="submit" disabled={!commentText[post.id]?.trim()} className="p-2 text-primary hover:bg-primary/10 rounded-full disabled:opacity-50 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                          </button>
                        </form>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card-premium p-12 text-center text-text-secondary">
                    <div className="text-4xl mb-4">📢</div>
                    <h3 className="text-lg font-bold text-text-main">Stream is empty</h3>
                    <p className="text-sm">There are no posts here yet.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'classwork' && (
            <div className="space-y-4">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-text-main">Assignments & Materials</h2>
                 <div className="flex gap-3">
                   <Link to={`/class/${id}/materials/create`} className="px-4 py-2 bg-white text-text-main font-bold rounded-full shadow-sm border border-border hover:bg-black/5 transition-all flex items-center gap-2 text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                      Material
                   </Link>
                   <Link to={`/class/${id}/assignments/create`} className="px-4 py-2 bg-primary text-white font-bold rounded-full shadow-md hover:bg-primary-hover transition-all flex items-center gap-2 text-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      Assignment
                   </Link>
                 </div>
               </div>
               {(classroom.assignments?.length > 0 || classroom.materials?.length > 0) ? (
                 <div className="space-y-3">
                    {classroom.assignments?.map(item => (
                      <Link to={`/class/${id}/assignments/${item.id}`} key={item.id} className="card-premium p-4 flex items-center gap-4 hover:bg-bg/50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📝</div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-text-main">{item.title}</h4>
                          <span className="text-xs text-text-secondary">Posted {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs font-medium text-text-secondary">Due {new Date(item.due_date).toLocaleDateString()}</div>
                      </Link>
                    ))}
                    {classroom.materials?.map(item => (
                      <Link to={`/class/${id}/materials/${item.id}`} key={item.id} className="card-premium p-4 flex items-center gap-4 hover:bg-bg/50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📚</div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-text-main">{item.title}</h4>
                          <span className="text-xs text-text-secondary">Posted {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    ))}
                 </div>
               ) : (
                 <div className="p-12 text-center text-text-secondary card-premium">
                    <h3 className="font-bold text-text-main">No classwork yet</h3>
                    <p className="text-sm mt-1">Assignments will appear here once created.</p>
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
