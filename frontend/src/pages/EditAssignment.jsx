import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';

const EditAssignment = () => {
  const { id, assignmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useNotification();
  const [classroom, setClassroom] = useState(null);
  const [assignment, setAssignment] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    subject_id: ''
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id, assignmentId]);

  const fetchData = async () => {
    try {
      const [resClass, resAssign] = await Promise.all([
        api.get(`/classrooms/${id}`),
        api.get(`/assignments/${assignmentId}`)
      ]);
      setClassroom(resClass.data);
      setAssignment(resAssign.data);
      
      setFormData({
        title: resAssign.data.title || '',
        description: resAssign.data.description || '',
        due_date: resAssign.data.due_date ? resAssign.data.due_date.split('T')[0] : '',
        subject_id: resAssign.data.subject_id || ''
      });
    } catch (err) {
      console.error("Error fetching assignment data:", err);
      showToast("Failed to load assignment data.", "error");
    } finally {
      setLoading(false);
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
    if (!formData.title) return showToast("Title is required!", "error");
    
    setSaving(true);
    try {
      const data = new FormData();
      // Since it's a PUT request with files in Laravel, we often use POST with _method=PUT
      data.append('_method', 'PUT');
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (formData.due_date) data.append('due_date', formData.due_date);
      if (formData.subject_id) data.append('subject_id', formData.subject_id);
      
      Array.from(files).forEach((file) => {
        data.append('files[]', file);
      });

      await api.post(`/assignments/${assignmentId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      showToast("Assignment updated successfully!", "success");
      navigate(`/class/${id}/assignments/${assignmentId}`);
    } catch (err) {
      showToast("Failed to update assignment.", "error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-5 text-text-secondary">
      <div className="w-12 h-12 bg-primary rounded-full animate-ping opacity-75"></div>
      <p>Loading assignment editor...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/class/${id}/assignments/${assignmentId}`)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-text-secondary transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Edit Assignment</h1>
            <p className="text-sm text-text-secondary">{classroom?.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/class/${id}/assignments/${assignmentId}`)}
            className="px-6 py-2 text-text-secondary font-medium hover:bg-black/5 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving || !formData.title}
            className="px-8 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
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
              Attachments (Add new)
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
              <p className="font-medium text-text-main mb-1">Click or drag files here</p>
            </div>
            
            {/* Existing Attachments */}
            {assignment?.attachments?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">Existing Attachments</h4>
                <div className="space-y-2">
                  {assignment.attachments.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border">
                      <span className="text-sm font-medium truncate pr-4">{file.file_path.split('/').pop()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-premium p-6 space-y-6">
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

export default EditAssignment;
