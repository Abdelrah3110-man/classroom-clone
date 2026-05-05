import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classroom, setClassroom] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    subject_id: ''
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchClassroomDetails();
  }, [id]);

  const fetchClassroomDetails = async () => {
    try {
      const res = await api.get(`/classrooms/${id}`);
      setClassroom(res.data);
    } catch (err) {
      console.error("Error fetching classroom:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("Title is required!");
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append('classroom_id', id);
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (formData.due_date) data.append('due_date', formData.due_date);
      if (formData.subject_id) data.append('subject_id', formData.subject_id);
      
      Array.from(files).forEach((file) => {
        data.append('files[]', file);
      });

      await api.post('/assignments', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate(`/class/${id}`);
    } catch (err) {
      alert("Failed to create assignment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/class/${id}`)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-text-secondary transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Create Assignment</h1>
            <p className="text-sm text-text-secondary">{classroom ? classroom.name : 'Loading...'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/class/${id}`)}
            className="px-6 py-2 text-text-secondary font-medium hover:bg-black/5 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !formData.title}
            className="px-8 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        {/* Main Form Area */}
        <div className="space-y-6">
          <div className="card-premium p-6">
            <div className="space-y-5">
              <div>
                <input 
                  type="text" 
                  name="title"
                  placeholder="Assignment title" 
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full text-xl p-4 bg-bg rounded-xl border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all placeholder:text-text-secondary/60 font-medium"
                />
              </div>
              <div>
                <textarea 
                  name="description"
                  placeholder="Instructions (optional)" 
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-4 min-h-[200px] bg-bg rounded-xl border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all resize-y"
                />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              Attachments
            </h3>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-black/5 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              </div>
              <p className="font-medium text-text-main mb-1">Click or drag files here to upload</p>
              <p className="text-sm text-text-secondary">Support for PDFs, images, and documents</p>
            </div>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {Array.from(files).map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-bg rounded-lg">
                    <span className="w-8 h-8 flex items-center justify-center bg-white rounded text-xs font-bold text-primary shadow-sm">
                      {file.name.split('.').pop().toUpperCase()}
                    </span>
                    <span className="text-sm font-medium truncate flex-grow">{file.name}</span>
                    <span className="text-xs text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="card-premium p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-text-main mb-2">For</label>
              <select className="w-full p-3 bg-bg rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium">
                <option>{classroom?.name || 'Current Class'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Points</label>
              <select className="w-full p-3 bg-bg rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium">
                <option>100</option>
                <option>Ungraded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Due Date</label>
              <input 
                type="date" 
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full p-3 bg-bg rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />
            </div>

            {classroom?.subjects?.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Topic</label>
                <select 
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleChange}
                  className="w-full p-3 bg-bg rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-medium"
                >
                  <option value="">No topic</option>
                  {classroom.subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
