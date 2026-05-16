import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import GoalTable from '../components/GoalTable';

export default function Dashboard() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]); const [updates, setUpdates] = useState([]); const [escalations, setEscalations] = useState([]);
  useEffect(() => { Promise.all([api.get('/goals'), api.get('/updates'), api.get('/admin/escalations')]).then(([g,u,e]) => { setGoals(g.data); setUpdates(u.data); setEscalations(e.data); }); }, [user]);
  const stats = useMemo(() => ({ approved: goals.filter(g => g.status === 'approved').length, submitted: goals.filter(g => g.status === 'submitted').length, locked: goals.filter(g => g.locked).length, avg: Math.round(updates.reduce((s,u)=>s+Number(u.progressScore||0),0)/(updates.length||1)) }), [goals, updates]);
  const chartData = ['draft','submitted','approved','rejected'].map(status => ({ status, count: goals.filter(g => g.status === status).length }));
  const title = user.role === 'employee' ? 'Employee Dashboard' : user.role === 'manager' ? 'Manager Dashboard' : 'Admin Dashboard';
  return <div className="space-y-6"><div><h2 className="text-2xl font-bold">{title}</h2><p className="text-sm text-gray-500">Simple overview of goals, approvals, check-ins, and escalations.</p></div><div className="grid gap-4 md:grid-cols-4"><StatCard label="Approved goals" value={stats.approved} note="Locked after approval"/><StatCard label="Pending approvals" value={stats.submitted}/><StatCard label="Locked goals" value={stats.locked}/><StatCard label="Average progress" value={`${stats.avg}%`}/></div><div className="grid gap-6 lg:grid-cols-3"><div className="card lg:col-span-2"><h3 className="mb-4 font-semibold">Goal status distribution</h3><div className="h-64"><ResponsiveContainer><BarChart data={chartData}><XAxis dataKey="status"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="count" fill="#2563eb"/></BarChart></ResponsiveContainer></div></div><div className="card"><h3 className="font-semibold">Pending actions</h3><ul className="mt-3 space-y-2 text-sm text-gray-700"><li>{stats.submitted} goal(s) waiting for manager approval.</li><li>{escalations.length} escalation alert(s) active.</li><li>Q1 window is seeded active for demos.</li></ul></div></div>{user.role === 'admin' && <AdminCycles />}<GoalTable goals={goals.slice(0,6)} updates={updates}/></div>;
}
function AdminCycles(){ const [cycles,setCycles]=useState([]); useEffect(()=>{api.get('/admin/cycles').then(({data})=>setCycles(data));},[]); async function toggle(c){const {data}=await api.patch(`/admin/cycles/${c._id}`,{active:!c.active}); setCycles(cycles.map(x=>x._id===c._id?data:x));} return <div className="card"><h3 className="font-semibold">Cycle window control</h3><div className="mt-3 grid gap-3 md:grid-cols-5">{cycles.map(c=><button key={c._id} onClick={()=>toggle(c)} className={`rounded border p-3 text-left ${c.active?'border-blue-600 bg-blue-50':'border-gray-200'}`}><p className="font-medium">{c.name}</p><p className="text-xs text-gray-500">{c.windowLabel}</p><p className="text-xs">{c.active?'Active':'Closed'}</p></button>)}</div></div> }
