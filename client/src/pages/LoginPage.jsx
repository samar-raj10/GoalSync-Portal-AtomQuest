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
  return <div className="flex min-h-screen items-center justify-center bg-base-200 px-4"><form onSubmit={submit} className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl"><div className="card-body"><h1 className="card-title text-2xl text-primary">GoalSync Portal</h1><p className="text-sm opacity-70">Demo credentials: employee@demo.com, manager@demo.com, admin@demo.com / demo123</p>{error && <div className="alert alert-error mt-4 py-2 text-sm">{error}</div>}<label className="form-control mt-4"><span className="label-text">Email</span><input className="input input-bordered" value={email} onChange={e => setEmail(e.target.value)} /></label><label className="form-control mt-2"><span className="label-text">Password</span><input className="input input-bordered" type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><button className="btn btn-primary mt-6" disabled={loading}>Sign in</button></div></form></div>;
}
