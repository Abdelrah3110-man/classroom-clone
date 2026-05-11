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
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 text-text-secondary animate-fade-in">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="font-medium tracking-wide">Syncing classroom workspace...</p>
    </div>
  );

  if (!classroom) return (
    <div className="p-20 text-center glass m-10 rounded-3xl max-w-2xl mx-auto shadow-premium animate-fade-in">
      <div className="text-6xl mb-6">🏜️</div>
      <h2 className="text-3xl font-bold mb-4 text-text-main">Classroom not found</h2>
      <p className="mb-8 text-text-secondary">This classroom might have been deleted, or you don't have permission to view it.</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in">
      {/* Premium Header Banner */}
      <div 
        className="h-[320px] rounded-3xl mt-6 relative overflow-hidden text-white flex items-end p-10 shadow-premium transition-transform hover:scale-[1.01] duration-500" 
        style={{ 
          background: `linear-gradient(135deg, ${classroom.banner_color || '#6366f1'} 0%, ${classroom.banner_color ? classroom.banner_color+'aa' : '#ec4899'} 100%)` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        {/* Settings button for teacher */}
        {classroom.teacher_id === JSON.parse(localStorage.getItem('user'))?.id && (
          <Link 
            to={`/class/${id}/edit`} 
            className="absolute top-6 left-6 p-2.5 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-xl transition-colors z-20 text-white"
            title="Classroom Settings"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </Link>
        )}

        <div className="relative z-10 flex-grow animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 tracking-tight">{classroom.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-lg font-medium opacity-90">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full">{classroom.section}</span>
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full">Room: {classroom.room || 'General'}</span>
          </div>
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-sm border border-white/30 shadow-lg font-mono tracking-widest font-bold flex flex-col items-end">
            <span>Class Code</span>
            <span className="text-xl tracking-[0.2em]">{classroom.code}</span>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="glass mt-8 rounded-2xl sticky top-20 z-30 mb-8 mx-auto w-fit px-2 py-2 flex gap-2">
        {['stream', 'classwork', 'people'].map(tab => (
          <button 
            key={tab}
            className={`px-8 py-3 font-semibold rounded-xl transition-all duration-300 capitalize ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-text-main hover:bg-slate-50'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-8 animate-slide-up">
          
          {activeTab === 'stream' && (
            <>
              {/* Post Creation Box */}
              <div className="glass p-6 rounded-3xl">
                <div className="flex gap-5">
                  <div className="avatar-circle w-12 h-12 text-lg flex-shrink-0 shadow-lg">{classroom.teacher?.name?.[0] || 'A'}</div>
                  <div className="flex-grow">
                    <textarea 
                      placeholder="Announce something to your class..."
                      className="w-full border-none outline-none bg-transparent resize-none pt-3 text-[16px] text-text-main placeholder-slate-400 min-h-[60px]"
                      value={newPost}
                      onChange={e => setNewPost(e.target.value)}
                    />
                    {newPost && (
                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200/50 animate-fade-in">
                        <button className="btn-secondary" onClick={() => setNewPost('')}>Cancel</button>
                        <button className="btn-primary flex items-center gap-2" onClick={handleCreatePost} disabled={isPosting}>
                          {isPosting ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Posting</>
                          ) : 'Post Announcement'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Feed */}
              <div className="space-y-6">
                {classroom.posts?.length > 0 ? (
                  classroom.posts.map((post, i) => (
                    <div key={post.id} className="card-premium p-6" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="flex gap-4 mb-5">
                        <div className="avatar-circle w-11 h-11 text-sm shadow-md">{post.user?.name?.[0]}</div>
                        <div>
                          <span className="block font-bold text-text-main text-[15px]">{post.user?.name}</span>
                          <span className="text-xs text-text-secondary font-medium">{new Date(post.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="text-[16px] leading-relaxed text-text-main mb-6 whitespace-pre-wrap">
                        {post.description || post.content}
                      </div>
                      
                      <div className="pt-5 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 px-6 pb-6">
                        {post.comments?.length > 0 && (
                          <div className="space-y-4 mb-5 pt-2">
                            {post.comments.map(comment => (
                              <div key={comment.id} className="flex gap-3 animate-fade-in">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                                  {comment.user?.name?.[0]}
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm shadow-sm flex-grow">
                                  <span className="font-bold text-text-main mr-2">{comment.user?.name}</span>
                                  <span className="text-text-secondary">{comment.content}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <form onSubmit={(e) => handleCreateComment(post.id, e)} className="flex items-center gap-3 relative mt-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-pink-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                            {classroom.teacher?.name?.[0] || 'M'}
                          </div>
                          <input 
                            type="text" 
                            placeholder="Add a class comment..." 
                            className="input-google !rounded-full !py-2.5 !bg-white/80" 
                            value={commentText[post.id] || ''}
                            onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})}
                          />
                          <button type="submit" disabled={!commentText[post.id]?.trim()} className="absolute right-2 p-1.5 text-primary hover:bg-primary/10 rounded-full disabled:opacity-30 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                          </button>
                        </form>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass p-16 text-center text-text-secondary rounded-3xl border-dashed">
                    <div className="text-6xl mb-6 opacity-80">📢</div>
                    <h3 className="text-xl font-bold text-text-main mb-2">Stream is empty</h3>
                    <p className="text-sm">This is where you can talk to your class.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'classwork' && (
            <div className="space-y-6 animate-fade-in">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 glass p-6 rounded-2xl">
                 <div>
                   <h2 className="text-2xl font-bold text-text-main">Classwork</h2>
                   <p className="text-text-secondary text-sm mt-1">Assignments and study materials</p>
                 </div>
                 <div className="flex gap-3">
                   <Link to={`/class/${id}/materials/create`} className="btn-secondary flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                      Material
                   </Link>
                   <Link to={`/class/${id}/assignments/create`} className="btn-primary flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      Assignment
                   </Link>
                 </div>
               </div>
               {(classroom.assignments?.length > 0 || classroom.materials?.length > 0) ? (
                 <div className="space-y-4">
                    {classroom.assignments?.map(item => (
                      <Link to={`/class/${id}/assignments/${item.id}`} key={item.id} className="card-premium p-5 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm">📝</div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-text-main text-lg group-hover:text-primary transition-colors">{item.title}</h4>
                          <span className="text-sm text-text-secondary font-medium">Posted {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm font-bold text-primary bg-primary/5 px-4 py-2 rounded-full">Due {new Date(item.due_date).toLocaleDateString()}</div>
                      </Link>
                    ))}
                    {classroom.materials?.map(item => (
                      <Link to={`/class/${id}/materials/${item.id}`} key={item.id} className="card-premium p-5 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm">📚</div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-text-main text-lg group-hover:text-secondary transition-colors">{item.title}</h4>
                          <span className="text-sm text-text-secondary font-medium">Posted {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    ))}
                 </div>
               ) : (
                 <div className="glass p-16 text-center text-text-secondary rounded-3xl border-dashed">
                    <div className="text-6xl mb-6 opacity-80">📁</div>
                    <h3 className="text-xl font-bold text-text-main mb-2">No classwork yet</h3>
                    <p className="text-sm">Assignments and materials will appear here.</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'people' && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h2 className="text-3xl font-extrabold text-primary border-b-2 border-primary/20 pb-4 mb-6 px-4">Teachers</h2>
                <div className="flex items-center gap-4 px-4 py-2">
                  <div className="avatar-circle w-12 h-12 text-lg shadow-md">{classroom.teacher?.name?.[0] || 'T'}</div>
                  <span className="font-bold text-text-main text-lg">{classroom.teacher?.name || 'Class Teacher'}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end border-b-2 border-slate-200 pb-4 mb-6 px-4">
                  <h2 className="text-3xl font-extrabold text-text-main">Classmates</h2>
                  <span className="font-bold text-primary">{classroom.students?.length || 0} students</span>
                </div>
                {classroom.students?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                    {classroom.students.map(student => (
                      <div key={student.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-colors">
                        <div className="avatar-circle w-10 h-10 shadow-sm bg-gradient-to-br from-slate-400 to-slate-600">{student.name?.[0]}</div>
                        <span className="font-semibold text-text-main">{student.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary px-4 italic">No students joined yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6 hidden lg:block animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="glass p-6 rounded-2xl sticky top-20">
            <h4 className="text-sm font-bold uppercase tracking-widest text-text-main mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Upcoming
            </h4>
            <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
              <p className="text-sm font-medium text-text-secondary mb-3">No work due soon</p>
              <Link to="#" className="text-sm font-bold text-primary hover:text-primary-hover transition-colors">View all work</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ClassDetails
