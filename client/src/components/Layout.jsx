import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const links = [
  { to: '/', label: 'Dashboard', roles: ['employee', 'manager', 'admin'] },
  { to: '/goals', label: 'Goal Creation', roles: ['employee'] },
  { to: '/approvals', label: 'Goal Approval', roles: ['manager'] },
  { to: '/checkins', label: 'Quarterly Check-in', roles: ['employee', 'manager'] },
  { to: '/reports', label: 'Reports', roles: ['manager', 'admin'] },
  { to: '/audit', label: 'Audit Logs', roles: ['admin'] }
];

export default function Layout() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => { api.get('/notifications').then(({ data }) => setNotifications(data)).catch(() => setNotifications([])); }, [user]);
  async function handleSwitch(role) { await switchRole(role); navigate('/'); }
  return <div className="drawer lg:drawer-open min-h-screen bg-base-200"><input id="main-drawer" type="checkbox" className="drawer-toggle" /><div className="drawer-content flex flex-col"><div className="navbar border-b border-base-300 bg-base-100"><div className="flex-none lg:hidden"><label htmlFor="main-drawer" className="btn btn-square btn-ghost">☰</label></div><div className="flex-1"><div><p className="font-semibold">{user.name}</p><p className="text-sm capitalize opacity-60">{user.role} • {user.department}</p></div></div><div className="indicator"><span className="indicator-item badge badge-primary badge-sm">{notifications.filter(n => !n.read).length}</span><button className="btn btn-ghost btn-sm">Notifications</button></div></div><main className="p-6"><Outlet /></main></div><div className="drawer-side"><label htmlFor="main-drawer" className="drawer-overlay" /><aside className="min-h-full w-72 border-r border-base-300 bg-base-100 p-5"><h1 className="text-xl font-bold text-primary">GoalSync Portal</h1><p className="text-xs opacity-60">Internal goal tracking</p><div className="card mt-6 border border-primary/20 bg-primary/5 shadow-none"><div className="card-body p-4"><label className="label py-0"><span className="label-text font-semibold">Demo role switcher</span></label><select className="select select-bordered select-sm mt-2" value={user.role} onChange={e => handleSwitch(e.target.value)}><option value="employee">Employee View</option><option value="manager">Manager View</option><option value="admin">Admin View</option></select></div></div><ul className="menu mt-6 rounded-box p-0">{links.filter(link => link.roles.includes(user.role)).map(link => <li key={link.to}><NavLink to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>{link.label}</NavLink></li>)}</ul><button className="btn btn-outline btn-sm mt-6 w-full" onClick={logout}>Log out</button></aside></div></div>;
}
