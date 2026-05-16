import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AuditLogsPage(){
  const [logs,setLogs]=useState([]); const [goals,setGoals]=useState([]); const [msg,setMsg]=useState('');
  async function load(){ const [logRes, goalRes]=await Promise.all([api.get('/admin/audit-logs'), api.get('/goals')]); setLogs(logRes.data); setGoals(goalRes.data); }
  useEffect(()=>{load();},[]);
  async function unlock(id){ setMsg(''); await api.post(`/goals/${id}/unlock`); setMsg('Goal unlocked and audit log recorded.'); await load(); }
  return <div className="space-y-6"><div><h2 className="text-2xl font-bold">Audit Logs</h2><p className="text-sm opacity-60">Tracks post-lock changes including admin unlocks and manager check-in comments.</p></div>{msg&&<div className="alert alert-info py-2 text-sm">{msg}</div>}<div className="card border border-base-300 bg-base-100 shadow-sm"><div className="card-body"><h3 className="card-title text-base">Admin unlock controls</h3><div className="grid gap-2 md:grid-cols-2">{goals.filter(g=>g.locked).map(g=><div className="flex items-center justify-between rounded-box border border-base-300 p-3" key={g._id}><div><p className="font-medium">{g.title}</p><p className="text-xs opacity-60">{g.employee?.name} • {g.status}</p></div><button className="btn btn-outline btn-sm" onClick={()=>unlock(g._id)}>Unlock</button></div>)}</div></div></div><div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm"><table className="table table-zebra table-sm"><thead><tr><th>Timestamp</th><th>Actor</th><th>Entity</th><th>Field</th><th>Old</th><th>New</th></tr></thead><tbody>{logs.map(log=><tr key={log._id}><td>{new Date(log.createdAt).toLocaleString()}</td><td>{log.actor?.name}</td><td>{log.entity}</td><td>{log.field}</td><td>{log.oldValue}</td><td>{log.newValue}</td></tr>)}</tbody></table></div></div>
}
