export default function ProgressBar({ value = 0 }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return <div><progress className="progress progress-primary w-full" value={safe} max="100" /><p className="mt-1 text-xs text-base-content/60">{safe}% progress</p></div>;
}
