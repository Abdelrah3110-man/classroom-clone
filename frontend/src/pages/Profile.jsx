import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const { showToast, showConfirm } = useNotification();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
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
      const res = await api.post('/profile', {
        user_id: user?.id,
        name: formData.name,
        email: formData.email
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      if (err.response) {
        setError(`Server Error (${err.response.status}): ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        setError("Network Error: No response from server. Check if backend is running on port 8080.");
      } else {
        setError(`Request Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    showConfirm(
      "Delete Account",
      "Are you sure you want to delete your account? This action is permanent and cannot be undone.",
      async () => {
        try {
          await api.delete('/profile', { data: { user_id: user?.id } });
          showToast("Account deleted successfully", "success");
          logout();
          navigate('/login');
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to delete account.', "error");
        }
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main">Account Settings</h1>
        <p className="text-text-secondary mt-1">Manage your profile and preferences.</p>
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
           
           <div className="border-t border-border pt-6 space-y-3">
             <button 
               onClick={logout}
               className="w-full flex items-center justify-center gap-2 bg-slate-100 text-text-main hover:bg-slate-200 px-6 py-3 rounded-xl font-bold transition-colors"
             >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
               Sign Out
             </button>
             <button 
               onClick={handleDeleteAccount}
               className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-xl font-bold transition-all border border-red-100"
             >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
               Delete Account
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

        </div>
      </div>
    </div>
  );
};

export default Profile;
