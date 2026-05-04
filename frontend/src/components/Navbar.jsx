import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useAuth();

  return (
    <>
      <nav className="h-16 flex items-center justify-between px-4 bg-white border-b border-border sticky top-0 z-[100] glass">
        <div className="flex items-center gap-1 md:gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:bg-black/5 transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <Link to="/" className="text-lg md:text-xl font-semibold text-text-secondary flex items-center gap-2">
            <span className="text-primary hidden sm:inline">Google</span> Classroom
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-text-secondary hover:bg-black/5 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:bg-black/5 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </button>
          <Link to="/profile" className="avatar-circle">
            {user?.name?.[0] || 'A'}
          </Link>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[200] animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        >
          {/* Sidebar Content */}
          <div 
            className="w-72 h-full bg-white shadow-2xl animate-slide-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
               <button 
                 onClick={() => setIsSidebarOpen(false)}
                 className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-all"
               >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
               <span className="text-xl font-semibold text-text-secondary">Menu</span>
            </div>

            <div className="py-4">
              <Link 
                to="/" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50 text-text-main font-medium transition-all group"
              >
                <div className="text-text-secondary group-hover:text-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                Classes
              </Link>
              
              <div className="my-2 border-t border-border"></div>
              
              <Link 
                to="/profile" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50 text-text-main font-medium transition-all group"
              >
                <div className="text-text-secondary group-hover:text-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                My Profile
              </Link>

              <button 
                onClick={() => { logout(); setIsSidebarOpen(false); }}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 text-red-600 font-medium transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

export default Navbar
