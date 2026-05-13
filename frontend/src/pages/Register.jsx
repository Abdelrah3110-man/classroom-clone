import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ApplicationLogo from '../components/ui/ApplicationLogo';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      showToast('Passwords do not match', 'error');
      setError('Passwords do not match');
      return;
    }
    
    try {
      const user = await register(name, email, password, passwordConfirm);
      if (user) {
        showToast(`Account created successfully! Welcome, ${user.name}`, 'success');
        navigate('/');
      }
    } catch (err) {
      showToast('Failed to create an account', 'error');
      setError('Failed to create an account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full glass p-10 rounded-[2.5rem] shadow-premium animate-fade-in relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-secondary/20 to-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10 text-center mb-8">
          <ApplicationLogo className="justify-center mb-6" />
          <h2 className="text-3xl font-extrabold text-text-main tracking-tight mb-2">Create Account</h2>
          <p className="text-text-secondary font-medium">Join us and start learning today</p>
        </div>

        {error && (
          <div className="relative z-10 mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <Input 
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <Input 
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input 
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input 
            label="Confirm Password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="pt-4">
            <Button type="submit" className="w-full text-lg">
              Sign Up
            </Button>
          </div>
        </form>

        <p className="relative z-10 mt-8 text-center text-text-secondary font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
