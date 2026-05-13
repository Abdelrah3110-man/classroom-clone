import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const EditClassroom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast, showConfirm } = useNotification();
  
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    subject: '',
    room: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClassroom();
  }, [id]);

  const fetchClassroom = async () => {
    try {
      const res = await api.get(`/classrooms/${id}`);
      if (res.data.teacher_id !== user?.id) {
        showToast("Unauthorized access", "error");
        navigate(`/class/${id}`);
        return;
      }
      setFormData({
        name: res.data.name || '',
        section: res.data.section || '',
        subject: res.data.subject || '',
        room: res.data.room || ''
      });
    } catch (err) {
      console.error(err);
      showToast("Error fetching classroom details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/classrooms/${id}`, formData);
      navigate(`/class/${id}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to update classroom.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    showConfirm(
      "Delete Classroom",
      "Are you sure you want to delete this classroom? This action cannot be undone.",
      async () => {
        try {
          await api.delete(`/classrooms/${id}`);
          showToast("Classroom deleted successfully", "success");
          navigate('/');
        } catch (err) {
          showToast("Failed to delete classroom.", "error");
        }
      }
    );
  };

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 text-text-secondary animate-fade-in">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      <div className="glass p-8 rounded-3xl shadow-premium">
        <h2 className="text-3xl font-extrabold text-text-main mb-8">Classroom Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Class Name (Required)</label>
            <input 
              type="text" 
              name="name"
              className="input-google"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Section</label>
            <input 
              type="text" 
              name="section"
              className="input-google"
              value={formData.section}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Subject</label>
            <input 
              type="text" 
              name="subject"
              className="input-google"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Room</label>
            <input 
              type="text" 
              name="room"
              className="input-google"
              value={formData.room}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button 
              type="button" 
              onClick={() => navigate(`/class/${id}`)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary flex-grow text-center justify-center"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t-2 border-red-100">
          <h3 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-text-secondary mb-4">Once you delete a classroom, there is no going back. Please be certain.</p>
          <button 
            onClick={handleDelete}
            className="w-full px-6 py-3 font-bold bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors border border-red-200"
          >
            Delete Classroom
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClassroom;
