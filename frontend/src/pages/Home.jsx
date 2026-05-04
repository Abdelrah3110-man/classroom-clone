import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ClassCard from '../components/ClassCard'

const Home = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await axios.get('/api/v1/classrooms');
        setClassrooms(res.data);
      } catch (err) {
        console.error("Error fetching classrooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your classrooms...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Your Classes</h1>
        <p>Welcome back! You have {classrooms.length} active classes.</p>
      </header>

      <div className="class-grid">
        {classrooms.map(classroom => (
          <ClassCard key={classroom.id} classroom={classroom} />
        ))}
      </div>

      <style>{`
        .home-header {
          padding: 32px 0 16px;
        }
        .home-header h1 {
          font-size: 28px;
          font-weight: 600;
          color: var(--text-main);
        }
        .home-header p {
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 16px;
          color: var(--text-secondary);
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(66, 133, 244, 0.1);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Home
