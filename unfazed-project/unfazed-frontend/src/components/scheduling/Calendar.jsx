export default function Calendar({ sessions }) {
  return (
    <ul className="space-y-2">
      {sessions.map((s) => (
        <li key={s._id} className="border border-line rounded-card bg-white px-4 py-3 flex justify-between text-sm">
          <span>{s.client_id?.name}</span>
          <span className="text-ink/60">{new Date(s.startTime).toLocaleString()}</span>
          <span className="capitalize text-ink/60">{s.status}</span>
        </li>
      ))}
    </ul>
  );
}
