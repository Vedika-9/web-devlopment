import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

export default function Dashboard() {
  const { therapist } = useAuth();
  const [sessions, setSessions] = useState(null);
  const [leads, setLeads] = useState(null);

  useEffect(() => {
    api.get('/scheduling/sessions/me').then((res) => setSessions(res.data));
    api.get('/therapists/leads').then((res) => setLeads(res.data));
  }, []);

  const upcoming = sessions?.filter((s) => new Date(s.startTime) > new Date() && s.status === 'booked').slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl mb-1">Welcome, {therapist?.name}</h1>
      <p className="text-ink/60 mb-8">
        Your branded link:{' '}
        <a className="text-moss-600" href={`/${therapist?.slug}`} target="_blank" rel="noreferrer">
          unfazed.in/{therapist?.slug}
        </a>
        {' '}· Plan: <span className="capitalize">{therapist?.subscriptionTier}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-line rounded-card bg-white p-5">
          <h2 className="font-serif text-lg mb-3">Upcoming sessions</h2>
          {!sessions ? (
            <Loader />
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-ink/50">Nothing booked yet.</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((s) => (
                <li key={s._id} className="text-sm flex justify-between border-b border-line pb-2">
                  <span>{s.client_id?.name}</span>
                  <span className="text-ink/60">{new Date(s.startTime).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-line rounded-card bg-white p-5">
          <h2 className="font-serif text-lg mb-3">Recent leads</h2>
          {!leads ? (
            <Loader />
          ) : leads.length === 0 ? (
            <p className="text-sm text-ink/50">No inquiries yet.</p>
          ) : (
            <ul className="space-y-2">
              {leads.slice(0, 5).map((l) => (
                <li key={l._id} className="text-sm flex justify-between border-b border-line pb-2">
                  <span>{l.name}</span>
                  <span className="text-ink/60">{l.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link to="/therapist/clients" className="text-sm text-moss-600">Manage clients →</Link>
        <Link to="/therapist/schedule" className="text-sm text-moss-600">Set availability →</Link>
        <Link to="/therapist/analytics" className="text-sm text-moss-600">View analytics →</Link>
      </div>
    </div>
  );
}
