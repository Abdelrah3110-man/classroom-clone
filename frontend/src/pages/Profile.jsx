import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto bg-white border border-border rounded-2xl p-10 shadow-sm">
        <div className="text-center mb-10">
           <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-4xl font-bold text-primary border border-border mx-auto mb-4">
             {user?.name?.[0]}
           </div>
           <h2 className="text-3xl font-bold text-text-main">{user?.name}</h2>
           <p className="text-text-secondary mt-1">{user?.email}</p>
        </div>
        
        <div className="border-t border-border pt-10">
           <h3 className="text-xl font-bold text-text-main mb-4">Account Settings</h3>
           <p className="text-text-secondary leading-relaxed">
             Manage your information, privacy, and security to make Classroom work better for you. 
             You can update your profile details and preferences from this panel.
           </p>
           
           <div className="mt-12 flex justify-center">
             <button 
               onClick={logout}
               className="bg-red-500 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-600 hover:-translate-y-0.5 transition-all active:scale-95"
             >
               Sign Out from Classroom
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
