import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Hero from '../../components/profile/Hero';
import ServiceCard from '../../components/profile/ServiceCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function BookingPage() {
  const { slug } = useParams();
  const [therapist, setTherapist] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [confirmed, setConfirmed] = useState(null);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [leadSent, setLeadSent] = useState(false);

  useEffect(() => {
    api.get(`/therapists/public/${slug}`).then((res) => setTherapist(res.data)).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!therapist) return;
    api.get(`/scheduling/${slug}/slots`, { params: { date } }).then((res) => setSlots(res.data.slots));
  }, [slug, date, therapist]);

  async function confirmBooking() {
    const res = await api.post(`/scheduling/${slug}/book`, {
      startTime: bookingSlot.startTime,
      endTime: bookingSlot.endTime,
      durationMinutes: 45,
      clientName: form.name,
      clientEmail: form.email,
      clientPhone: form.phone,
    });
    setConfirmed(res.data.session);
    setBookingSlot(null);
  }

  async function submitLead(e) {
    e.preventDefault();
    await api.post(`/therapists/public/${slug}/leads`, leadForm);
    setLeadSent(true);
  }

  if (loading) return <Loader label="Loading profile…" />;
  if (!therapist) return <div className="p-10 text-center text-ink/60">Profile not found.</div>;

  return (
    <div>
      <Hero therapist={therapist} />
      <div className="max-w-3xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-3 mb-10">
        {therapist.specializations?.map((s) => <ServiceCard key={s} label={s} />)}
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="font-serif text-2xl mb-4">Book a session</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-line rounded-card px-3 py-2 mb-4 bg-white"
        />
        <div className="grid grid-cols-3 gap-2 mb-10">
          {slots.length === 0 && <p className="text-ink/50 text-sm col-span-3">No open slots this day.</p>}
          {slots.map((s) => (
            <button
              key={s.startTime}
              onClick={() => setBookingSlot(s)}
              className="border border-line rounded-card py-2 text-sm bg-white hover:border-moss-500"
            >
              {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </button>
          ))}
        </div>

        <div className="border-t border-line pt-8">
          <h3 className="font-serif text-xl mb-2">Not ready to book?</h3>
          <p className="text-ink/60 text-sm mb-4">Leave your details and {therapist.name} will reach out.</p>
          {leadSent ? (
            <p className="text-moss-600 text-sm">Thanks — you'll hear back soon.</p>
          ) : (
            <form onSubmit={submitLead} className="grid md:grid-cols-3 gap-2">
              <input placeholder="Name" required className="border border-line rounded-card px-3 py-2 bg-white" onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} />
              <input placeholder="Email" type="email" required className="border border-line rounded-card px-3 py-2 bg-white" onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} />
              <input placeholder="Phone" className="border border-line rounded-card px-3 py-2 bg-white" onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
              <Button type="submit" className="md:col-span-3">Send inquiry</Button>
            </form>
          )}
        </div>
      </div>

      <Modal open={!!bookingSlot} onClose={() => setBookingSlot(null)} title="Confirm your details">
        <div className="space-y-3">
          <input placeholder="Full name" className="w-full border border-line rounded-card px-3 py-2" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" type="email" className="w-full border border-line rounded-card px-3 py-2" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" className="w-full border border-line rounded-card px-3 py-2" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Button onClick={confirmBooking} className="w-full">Confirm booking</Button>
        </div>
      </Modal>

      <Modal open={!!confirmed} onClose={() => setConfirmed(null)} title="Booking confirmed">
        <p className="text-sm text-ink/70">
          Your session is confirmed for {confirmed && new Date(confirmed.startTime).toLocaleString()}. A confirmation has been sent to your email.
        </p>
      </Modal>
    </div>
  );
}
