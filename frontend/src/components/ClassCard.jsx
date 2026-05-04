import React from 'react'
import { Link } from 'react-router-dom'

const ClassCard = ({ classroom }) => {
  const { id, name, section, user, banner_color } = classroom;

  return (
    <div className="card animate-fade-in">
      <div className="card-header" style={{ backgroundColor: banner_color || '#4285f4' }}>
        <Link to={`/class/${id}`} className="card-title">{name}</Link>
        <div className="card-subtitle">{section}</div>
        <div className="card-subtitle" style={{ marginTop: '4px' }}>{user?.name}</div>
        
        <div className="teacher-avatar">
          {user?.name?.[0] || 'T'}
        </div>
      </div>
      <div className="card-body">
        <div className="next-task">
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Next Task</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>No upcoming tasks</p>
        </div>
      </div>
      <div className="card-footer">
        <button className="footer-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>
        <button className="footer-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        </button>
      </div>

      <style>{`
        .teacher-avatar {
          position: absolute;
          right: 16px;
          bottom: -28px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #fff;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 500;
          color: var(--primary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 2;
        }
        .footer-icon {
          color: var(--secondary);
          padding: 8px;
          border-radius: 50%;
          transition: var(--transition);
        }
        .footer-icon:hover {
          background-color: rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  )
}

export default ClassCard
