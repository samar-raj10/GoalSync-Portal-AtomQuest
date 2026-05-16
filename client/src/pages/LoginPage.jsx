import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState('employee@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  if (user) return <Navigate to="/" replace />;
  async function submit(e) { e.preventDefault(); setError(''); try { await login(email, password); } catch (err) { setError(err.response?.data?.message || 'Login failed'); } }
  return <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4"><form onSubmit={submit} className="card w-full max-w-md"><h1 className="text-2xl font-bold text-blue-700">GoalSync Portal</h1><p className="mt-2 text-sm text-gray-600">Demo credentials: employee@demo.com, manager@demo.com, admin@demo.com / demo123</p>{error && <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}<label className="mt-5 block text-sm font-medium">Email</label><input className="input mt-1" value={email} onChange={e => setEmail(e.target.value)} /><label className="mt-4 block text-sm font-medium">Password</label><input className="input mt-1" type="password" value={password} onChange={e => setPassword(e.target.value)} /><button className="btn mt-6 w-full" disabled={loading}>Sign in</button></form></div>;
}
