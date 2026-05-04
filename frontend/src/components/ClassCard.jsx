import React from 'react'
import { Link } from 'react-router-dom'

const ClassCard = ({ classroom }) => {
  const { id, name, section, user, banner_color } = classroom;

  return (
    <div className="card-premium flex flex-col group animate-fade-in">
      <div 
        className="h-[100px] p-4 text-white relative flex flex-col justify-start" 
        style={{ backgroundColor: banner_color || '#4285f4' }}
      >
        <Link to={`/class/${id}`} className="text-xl font-medium truncate z-10 hover:underline">
          {name}
        </Link>
        <div className="text-[13px] opacity-90 z-10">{section}</div>
        <div className="text-[13px] mt-1 z-10">{user?.name}</div>
        
        <div className="absolute right-4 -bottom-7 w-14 h-14 rounded-full bg-white border border-border flex items-center justify-center text-2xl font-medium text-primary shadow-md z-20">
          {user?.name?.[0] || 'T'}
        </div>
      </div>
      
      <div className="p-4 flex-grow min-h-[120px] flex flex-col justify-between">
        <div className="mt-2">
          <p className="text-[12px] text-text-secondary font-medium">Next Task</p>
          <p className="text-[13px] mt-1 text-text-main">No upcoming tasks</p>
        </div>
      </div>
      
      <div className="p-3 px-4 border-t border-border flex justify-end gap-3">
        <button className="p-2 rounded-full text-text-secondary hover:bg-black/5 transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>
        <button className="p-2 rounded-full text-text-secondary hover:bg-black/5 transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </button>
      </div>
    </div>
  )
}

export default ClassCard
