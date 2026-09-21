import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Loader from '../../components/common/Loader';

export default function ClientProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/clients/${id}`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <Loader />;
  const { client, sessions, payments } = data;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl mb-1">{client.name}</h1>
      <p className="text-ink/60 mb-8">{client.email} {client.phone && `· ${client.phone}`}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-line rounded-card bg-white p-5">
          <h2 className="font-serif text-lg mb-3">Session history</h2>
          {sessions.length === 0 ? <p className="text-sm text-ink/50">No sessions yet.</p> : (
            <ul className="space-y-2 text-sm">
              {sessions.map((s) => (
                <li key={s._id} className="flex justify-between border-b border-line pb-2">
                  <span>{new Date(s.startTime).toLocaleString()}</span>
                  <span className="capitalize text-ink/60">{s.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border border-line rounded-card bg-white p-5">
          <h2 className="font-serif text-lg mb-3">Payment history</h2>
          {payments.length === 0 ? <p className="text-sm text-ink/50">No payments yet.</p> : (
            <ul className="space-y-2 text-sm">
              {payments.map((p) => (
                <li key={p._id} className="flex justify-between border-b border-line pb-2">
                  <span>₹{(p.amount / 100).toFixed(2)}</span>
                  <span className="capitalize text-ink/60">{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
