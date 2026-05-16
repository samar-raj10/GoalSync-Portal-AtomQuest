import { statusColor } from '../utils/validation';
import ProgressBar from './ProgressBar';

export default function GoalTable({ goals, updates = [], actions }) {
  return <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm"><table className="table table-zebra table-sm"><thead><tr><th>Employee</th><th>Goal</th><th>Target</th><th>Weight</th><th>Status</th><th>Progress</th><th>Actions</th></tr></thead><tbody>{goals.map(goal => { const update = updates.find(u => String(u.goal?._id || u.goal) === String(goal._id)); return <tr key={goal._id}><td>{goal.employee?.name || 'Me'}</td><td><p className="font-medium">{goal.title}</p><p className="text-xs opacity-60">{goal.thrustArea}</p>{goal.sharedGoal && <span className="badge badge-info badge-sm mt-1">Shared</span>}</td><td>{goal.target}</td><td>{goal.weightage}%</td><td><span className={`badge badge-sm ${statusColor(goal.status)}`}>{goal.status}</span>{goal.locked && <span className="badge badge-neutral badge-sm ml-1">Locked</span>}</td><td className="min-w-40"><ProgressBar value={update?.progressScore || 0} /></td><td>{actions?.(goal)}</td></tr>; })}</tbody></table></div>;
}
