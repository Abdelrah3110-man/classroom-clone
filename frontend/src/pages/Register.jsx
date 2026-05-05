import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData.name, formData.email, formData.password);
    if (success) {
      navigate('/');
    } else {
      alert("Registration failed. Please check your connection or database.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 animate-fade-in">
      <div className="w-full max-w-[500px] bg-white border border-border rounded-xl p-10 md:p-12 text-center shadow-sm">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-8">
            <span className="text-primary">Google</span> <span className="text-text-secondary font-normal">Classroom</span>
          </h1>
          <h2 className="text-2xl font-normal mb-2">Create your account</h2>
          <p className="text-text-secondary">to continue to Classroom</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Name" 
            required 
            className="input-google"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Email address" 
            required 
            className="input-google"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            className="input-google"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          
          <div className="flex justify-between items-center mt-10">
            <Link to="/login" className="text-primary font-bold text-sm hover:bg-blue-50 px-3 py-2 rounded transition-all">Sign in instead</Link>
            <button type="submit" className="bg-primary text-white px-8 py-2 rounded font-bold hover:bg-primary-hover shadow-md transition-all active:scale-95">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
