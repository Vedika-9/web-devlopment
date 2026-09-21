export default function StatCard({ label, value }) {
  return (
    <div className="border border-line rounded-card bg-white p-5">
      <p className="text-ink/50 text-xs uppercase mb-1">{label}</p>
      <p className="font-serif text-3xl">{value}</p>
    </div>
  );
}
