import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MaterialDetails = () => {
  const { id, materialId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [material, setMaterial] = useState(null);
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id, materialId]);

  const fetchData = async () => {
    try {
      const resClassroom = await api.get(`/classrooms/${id}`);
      setClassroom(resClassroom.data);
      
      const resMaterial = await api.get(`/materials/${materialId}`);
      setMaterial(resMaterial.data);
    } catch (err) {
      console.error("Error fetching material:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-5 text-text-secondary">
      <div className="w-12 h-12 bg-primary rounded-full animate-ping opacity-75"></div>
      <p>Loading material...</p>
    </div>
  );

  if (!material) return (
    <div className="p-20 text-center bg-white m-10 rounded-2xl border border-border">
      <h2 className="text-2xl font-bold mb-4">Material not found</h2>
      <button onClick={() => navigate(`/class/${id}`)} className="btn-primary">Back to Class</button>
    </div>
  );

  const isTeacher = classroom?.teacher_id === user?.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(`/class/${id}`)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-text-secondary transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-main">{classroom?.name}</h1>
        </div>
      </div>

      <div className="card-premium p-8 shadow-xl border border-border/50">
        <div className="flex items-start gap-4 border-b border-border pb-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl flex-shrink-0 mt-1">
            📚
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-text-main mb-2">{material.title}</h1>
              {isTeacher && (
                <button 
                  onClick={() => navigate(`/class/${id}/materials/${materialId}/edit`)}
                  className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                  title="Edit Material"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              )}
            </div>
            <div className="flex items-center text-sm text-text-secondary mb-6">
              <span>{classroom?.teacher?.name || 'Teacher'} • {new Date(material.created_at).toLocaleDateString()}</span>
            </div>
            <div className="prose max-w-none text-text-main">
              {material.description ? (
                <p className="whitespace-pre-wrap">{material.description}</p>
              ) : (
                <p className="italic text-text-secondary">No description provided.</p>
              )}
            </div>
          </div>
        </div>

        {material.attachments?.length > 0 && (
          <div className="pt-6">
            <h3 className="font-bold text-text-main mb-4">Attachments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {material.attachments.map(file => (
                <a 
                  key={file.id} 
                  href={`http://127.0.0.1:8080/storage/${file.file_path}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 bg-bg border border-border rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 bg-white text-blue-500 rounded-lg flex items-center justify-center font-bold text-xs uppercase group-hover:scale-110 transition-transform shadow-sm">
                    {file.file_path.split('.').pop()}
                  </div>
                  <div className="overflow-hidden flex-grow">
                    <p className="text-sm font-bold text-text-main truncate">{file.file_path.split('/').pop()}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialDetails;
