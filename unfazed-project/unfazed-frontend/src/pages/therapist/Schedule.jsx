import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Calendar from '../../components/scheduling/Calendar';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Schedule() {
  const [availability, setAvailability] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/scheduling/availability/me').then((res) =>
      setAvailability(res.data || { timezone: 'Asia/Kolkata', recurring: [], overrides: [], bufferMinutes: 10, sessionDurations: [30, 45, 60] })
    );
    api.get('/scheduling/sessions/me').then((res) => setSessions(res.data));
  }, []);

  function toggleDay(dayOfWeek) {
    const exists = availability.recurring.find((r) => r.dayOfWeek === dayOfWeek);
    if (exists) {
      setAvailability({ ...availability, recurring: availability.recurring.filter((r) => r.dayOfWeek !== dayOfWeek) });
    } else {
      setAvailability({
        ...availability,
        recurring: [...availability.recurring, { dayOfWeek, startTime: '09:00', endTime: '17:00' }],
      });
    }
  }

  function updateWindow(dayOfWeek, field, value) {
    setAvailability({
      ...availability,
      recurring: availability.recurring.map((r) => (r.dayOfWeek === dayOfWeek ? { ...r, [field]: value } : r)),
    });
  }

  async function save() {
    setSaving(true);
    await api.put('/scheduling/availability/me', availability);
    setSaving(false);
  }

  if (!availability || !sessions) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl mb-6">Schedule</h1>

      <div className="border border-line rounded-card bg-white p-5 mb-8">
        <h2 className="font-serif text-lg mb-4">Weekly availability</h2>
        <div className="space-y-2">
          {DAYS.map((label, i) => {
            const window = availability.recurring.find((r) => r.dayOfWeek === i);
            return (
              <div key={i} className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-2 w-24">
                  <input type="checkbox" checked={!!window} onChange={() => toggleDay(i)} />
                  {label}
                </label>
                {window && (
                  <>
                    <input type="time" value={window.startTime} onChange={(e) => updateWindow(i, 'startTime', e.target.value)} className="border border-line rounded-card px-2 py-1" />
                    <span>to</span>
                    <input type="time" value={window.endTime} onChange={(e) => updateWindow(i, 'endTime', e.target.value)} className="border border-line rounded-card px-2 py-1" />
                  </>
                )}
              </div>
            );
          })}
        </div>
        <Button onClick={save} disabled={saving} className="mt-4">{saving ? 'Saving…' : 'Save availability'}</Button>
      </div>

      <h2 className="font-serif text-lg mb-3">All sessions</h2>
      <Calendar sessions={sessions} />
    </div>
  );
}
