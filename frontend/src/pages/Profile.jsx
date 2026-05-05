import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const res = await api.put('/profile', {
        name: formData.name,
        email: formData.email
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.new_password_confirmation) {
      return setError('New passwords do not match.');
    }
    
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      await api.put('/profile/password', {
        current_password: formData.current_password,
        password: formData.new_password,
        password_confirmation: formData.new_password_confirmation
      });
      setSuccess('Password updated successfully!');
      setFormData({ ...formData, current_password: '', new_password: '', new_password_confirmation: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main">Account Settings</h1>
        <p className="text-text-secondary mt-1">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        
        {/* Left Sidebar Profile Summary */}
        <div className="card-premium p-8 text-center h-fit">
           <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-5xl font-bold text-primary mx-auto mb-6 shadow-inner">
             {user?.name?.[0]?.toUpperCase()}
           </div>
           <h2 className="text-2xl font-bold text-text-main">{user?.name}</h2>
           <p className="text-text-secondary mt-1 mb-2">{user?.email}</p>
           <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full mb-8">
             {user?.role}
           </span>
           
           <div className="border-t border-border pt-6">
             <button 
               onClick={logout}
               className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-bold transition-colors"
             >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
               Sign Out
             </button>
           </div>
        </div>

        {/* Right Forms Area */}
        <div className="space-y-6">
          
          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-medium">
              {success}
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div className="card-premium p-8">
            <h3 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 bg-bg rounded-xl border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-bg rounded-xl border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-medium"
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-hover disabled:opacity-50 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="card-premium p-8">
            <h3 className="text-xl font-bold text-text-main mb-6 border-b border-border pb-4">Change Password</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Current Password</label>
                <input 
                  type="password" 
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  className="w-full p-4 bg-bg rounded-xl border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">New Password</label>
                  <input 
                    type="password" 
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className="w-full p-4 bg-bg rounded-xl border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="new_password_confirmation"
                    value={formData.new_password_confirmation}
                    onChange={handleChange}
                    className="w-full p-4 bg-bg rounded-xl border border-transparent focus:bg-white focus:border-primary focus:outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={loading || !formData.new_password}
                  className="px-8 py-3 bg-gray-800 text-white font-bold rounded-xl shadow-md hover:bg-black disabled:opacity-50 transition-all"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
