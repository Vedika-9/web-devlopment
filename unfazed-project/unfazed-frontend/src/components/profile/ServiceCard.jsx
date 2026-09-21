export default function ServiceCard({ label }) {
  return (
    <div className="border border-line rounded-card px-4 py-3 bg-white">
      <span className="text-sm text-ink/80">{label}</span>
    </div>
  );
}
