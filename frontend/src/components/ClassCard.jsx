import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ClassCard = ({ classroom, onJoin }) => {
  const { user } = useAuth();
  const { id, name, section, teacher, banner_color, students, assignments } = classroom;
  
  const nextAssignment = assignments?.length > 0 
    ? assignments
        .filter(a => new Date(a.due_date) > new Date())
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0]
    : null;

  const isTeacher = String(user?.id) === String(teacher?.id);
  const isStudent = students?.some(s => String(s.id) === String(user?.id));
  const isJoined = isTeacher || isStudent;

  return (
    <div className="card-premium flex flex-col group animate-fade-in overflow-hidden">
      <div 
        className="h-[120px] p-5 text-white relative flex flex-col justify-start" 
        style={{ backgroundColor: banner_color || '#4285f4' }}
      >
        <div className="flex justify-between items-start z-10">
          <Link to={isJoined ? `/class/${id}` : '#'} className={`text-xl font-bold truncate pr-10 ${isJoined ? 'hover:underline' : 'cursor-default'}`}>
            {name}
          </Link>
          {isTeacher && (
            <span className="bg-white/20 backdrop-blur-md text-[10px] uppercase tracking-widest font-extrabold px-2 py-1 rounded-md border border-white/30">
              Teacher
            </span>
          )}
          {isStudent && (
            <span className="bg-white/20 backdrop-blur-md text-[10px] uppercase tracking-widest font-extrabold px-2 py-1 rounded-md border border-white/30">
              Student
            </span>
          )}
        </div>
        <div className="text-sm opacity-90 z-10 font-medium mt-1">{section}</div>
        <div className="text-sm mt-1 z-10 opacity-80">{teacher?.name}</div>
        
        <div className="absolute right-5 -bottom-7 w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl font-extrabold text-primary shadow-xl z-20 group-hover:-rotate-6 transition-transform">
          {teacher?.name?.[0] || 'T'}
        </div>
      </div>
      
      <div className="p-6 flex-grow min-h-[140px] flex flex-col justify-between bg-white">
        <div className="space-y-4">
          {!isJoined ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 text-center">
              <p className="text-sm text-text-secondary font-medium mb-3">You are not in this class</p>
              <button 
                onClick={() => onJoin(classroom.code)}
                className="w-full py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                Join Class
              </button>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-text-secondary font-bold uppercase tracking-wider">Next Task</p>
              {nextAssignment ? (
                <div className="mt-2">
                  <p className="text-[14px] text-text-main font-bold truncate">{nextAssignment.title}</p>
                  <p className="text-[11px] text-primary font-medium mt-0.5">Due {new Date(nextAssignment.due_date).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-[14px] mt-1.5 text-text-main font-medium italic opacity-60">No upcoming tasks</p>
              )}
            </div>
          )}
        </div>

        {isJoined && (
          <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end gap-2">
            <Link 
              to={`/class/${id}`}
              className="p-2.5 rounded-xl text-primary hover:bg-primary/5 transition-all"
              title="Open Class"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassCard
