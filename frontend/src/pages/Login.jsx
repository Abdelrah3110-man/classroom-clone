import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 animate-fade-in">
      <div className="w-full max-w-[450px] bg-white border border-border rounded-xl p-10 md:p-12 text-center shadow-sm">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-8">
            <span className="text-primary">Google</span> <span className="text-text-secondary font-normal">Classroom</span>
          </h1>
          <h2 className="text-2xl font-normal mb-2">Sign in</h2>
          <p className="text-text-secondary">Use your Classroom account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email or phone" 
            required 
            className="input-google"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Enter your password" 
            required 
            className="input-google"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          
          <div className="flex justify-between items-center mt-10">
            <Link to="/register" className="text-primary font-bold text-sm hover:bg-blue-50 px-3 py-2 rounded transition-all">Create account</Link>
            <button type="submit" className="bg-primary text-white px-8 py-2 rounded font-bold hover:bg-primary-hover shadow-md transition-all active:scale-95">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
