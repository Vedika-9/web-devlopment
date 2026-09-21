export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-ink/60 text-sm py-6">
      <span className="h-3 w-3 rounded-full bg-moss-500 animate-pulse" />
      {label}
    </div>
  );
}
