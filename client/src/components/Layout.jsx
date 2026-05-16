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
  return <div className="flex min-h-screen">
    <aside className="w-64 border-r border-gray-200 bg-white p-5">
      <h1 className="text-xl font-bold text-blue-700">GoalSync Portal</h1>
      <p className="mt-1 text-xs text-gray-500">Internal goal tracking</p>
      <div className="mt-6 rounded border border-blue-100 bg-blue-50 p-3">
        <label className="text-xs font-semibold text-gray-600">Demo role switcher</label>
        <select className="input mt-2" value={user.role} onChange={e => handleSwitch(e.target.value)}>
          <option value="employee">Employee View</option><option value="manager">Manager View</option><option value="admin">Admin View</option>
        </select>
      </div>
      <nav className="mt-6 space-y-1">
        {links.filter(link => link.roles.includes(user.role)).map(link => <NavLink key={link.to} to={link.to} className={({ isActive }) => `block rounded px-3 py-2 text-sm ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>{link.label}</NavLink>)}
      </nav>
      <button className="btn-secondary mt-6 w-full" onClick={logout}>Log out</button>
    </aside>
    <main className="flex-1">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div><p className="font-semibold">{user.name}</p><p className="text-sm capitalize text-gray-500">{user.role} • {user.department}</p></div>
        <div className="text-right"><p className="text-sm font-medium">Notifications</p><p className="text-xs text-gray-500">{notifications.filter(n => !n.read).length} unread</p></div>
      </header>
      <div className="p-6"><Outlet /></div>
    </main>
  </div>;
}
