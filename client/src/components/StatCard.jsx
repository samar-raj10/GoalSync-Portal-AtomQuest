export default function StatCard({ label, value, note }) {
  return <div className="card bg-base-100 shadow-sm border border-base-300"><div className="card-body p-5"><p className="text-sm text-base-content/60">{label}</p><p className="text-3xl font-bold text-base-content">{value}</p>{note && <p className="text-xs text-base-content/60">{note}</p>}</div></div>;
}
