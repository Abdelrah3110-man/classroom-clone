import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ApplicationLogo from './ui/ApplicationLogo'
import api from '../api/axios'

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const [classrooms, setClassrooms] = useState([]);
  const [showCreated, setShowCreated] = useState(false);
  const [showJoined, setShowJoined] = useState(false);

  useEffect(() => {
    if (user && isSidebarOpen) {
      fetchClassrooms();
    }
  }, [user, isSidebarOpen]);

  const fetchClassrooms = async () => {
    try {
      const res = await api.get(`/classrooms?user_id=${user?.id}`);
      setClassrooms(res.data);
    } catch (err) {
      // Logout error
    }
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  const createdClasses = classrooms.filter(c => String(c.teacher_id) === String(user?.id));
  const joinedClasses = classrooms.filter(c => c.students?.some(s => String(s.id) === String(user?.id)) && String(c.teacher_id) !== String(user?.id));

  return (
    <>
      <nav className="h-16 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <ApplicationLogo className="scale-90 md:scale-100 origin-left" />
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {/* Quick Actions (Desktop only) */}
          <div className="hidden sm:flex items-center gap-2">
            <Link 
              to="/?action=join" 
              className="text-sm font-bold text-text-secondary hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors"
            >
              Join Class
            </Link>
            <Link 
              to="/?action=create" 
              className="text-sm font-bold bg-slate-50 border border-slate-200 text-text-main hover:bg-slate-100 px-4 py-2 rounded-xl transition-colors"
            >
              Create Class
            </Link>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

          {/* User Avatar */}
          <Link 
            to="/profile" 
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            title={user?.name}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </Link>

          {/* Menu Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors ml-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        >
          {/* Sidebar Content */}
          <div 
            className="absolute top-0 right-0 w-[300px] h-full bg-white shadow-2xl animate-slide-in flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
               <h5 className="text-xl font-bold text-text-main">Menu</h5>
               <button 
                 onClick={() => setIsSidebarOpen(false)}
                 className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
               >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              
              {/* User Profile Card */}
              <Link 
                to="/profile" 
                onClick={() => setIsSidebarOpen(false)}
                className="block mb-6 p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:-translate-y-0.5 transition-all"
              >
                <div className="font-bold text-text-main text-lg truncate">{user?.name}</div>
                <div className="text-sm text-text-secondary truncate">{user?.email}</div>
              </Link>

              {/* Main Nav Links */}
              <div className="space-y-1 mb-6">
                <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 font-bold text-text-main transition-colors">
                  <span className="text-xl">🏠</span> Home
                </Link>
                <Link to="/?action=join" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 font-bold text-text-main transition-colors">
                  <span className="text-xl">➕</span> Join Class
                </Link>
                <Link to="/?action=create" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 font-bold text-text-main transition-colors">
                  <span className="text-xl">🛠️</span> Create Class
                </Link>
                <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 font-bold text-text-main transition-colors">
                  <span className="text-xl">📊</span> Dashboard
                </Link>
              </div>

              {/* Created Classes Accordion */}
              <div className="mb-2">
                <button 
                  onClick={() => setShowCreated(!showCreated)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left font-bold text-text-main hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <span>Created Classes</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform duration-300 ${showCreated ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${showCreated ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  {createdClasses.length > 0 ? (
                    <div className="pl-4 border-l-2 border-slate-100 ml-6 space-y-1 py-2">
                      {createdClasses.map(c => (
                        <Link 
                          key={c.id} 
                          to={`/class/${c.id}`} 
                          onClick={() => setIsSidebarOpen(false)}
                          className="block px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="font-bold text-sm text-text-main truncate">{c.name}</div>
                          <div className="text-xs font-mono text-text-secondary font-bold tracking-widest mt-0.5">CODE: {c.code}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-10 py-2 text-sm text-text-secondary">No created classes</div>
                  )}
                </div>
              </div>

              <hr className="my-2 border-slate-100" />

              {/* Joined Classes Accordion */}
              <div className="mb-6">
                <button 
                  onClick={() => setShowJoined(!showJoined)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left font-bold text-text-main hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <span>Joined Classes</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform duration-300 ${showJoined ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${showJoined ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  {joinedClasses.length > 0 ? (
                    <div className="pl-4 border-l-2 border-slate-100 ml-6 space-y-1 py-2">
                      {joinedClasses.map(c => (
                        <Link 
                          key={c.id} 
                          to={`/class/${c.id}`} 
                          onClick={() => setIsSidebarOpen(false)}
                          className="block px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-bold text-sm text-text-main truncate"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-10 py-2 text-sm text-text-secondary">No joined classes</div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-200">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors border border-red-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}

export default Navbar
