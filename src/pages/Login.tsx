import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Beaker } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      // Navigation is handled by useEffect or here if useEffect delay is undesirable,
      // but useEffect is safer for "already logged in" check.
      // However, after login(), isAuthenticated becomes true, triggering useEffect.
      // But login() is async.
      // Let's keep manual navigate here as well for immediate feedback?
      // No, let's rely on state or explicit navigate.
      // If I remove navigate from here, I rely on state update.
      // But `login` waits for authService.
      // Let's keep explicit navigate here to be sure, or just rely on useEffect?
      // Since `login` is awaited, `setUser` is called. `isAuthenticated` changes. Effect runs.
      // But `navigate` inside handleSubmit is faster if state update is batched/delayed?
      // Actually, standard pattern is redirect if *already* authenticated (on mount).
      // For form submission, we can navigate manually.
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary-500 p-3 rounded-xl mb-4">
             <Beaker className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500">Sign in to LabControl 2.0</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Demo Credentials: admin / admin</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
