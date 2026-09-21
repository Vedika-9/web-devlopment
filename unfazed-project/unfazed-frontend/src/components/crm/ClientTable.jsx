import { Link } from 'react-router-dom';

export default function ClientTable({ clients }) {
  return (
    <table className="w-full text-sm border border-line rounded-card overflow-hidden bg-white">
      <thead className="bg-moss-50 text-ink/70 text-left">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Tags</th>
          <th className="px-4 py-2">Last session</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((c) => (
          <tr key={c._id} className="border-t border-line hover:bg-moss-50/50">
            <td className="px-4 py-2">
              <Link to={`/therapist/clients/${c._id}`} className="text-moss-700">{c.name}</Link>
            </td>
            <td className="px-4 py-2 capitalize">{c.status}</td>
            <td className="px-4 py-2">{c.tags?.join(', ')}</td>
            <td className="px-4 py-2">{c.lastSessionAt ? new Date(c.lastSessionAt).toLocaleDateString() : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
