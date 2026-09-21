import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import ClientTable from '../../components/crm/ClientTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { useEntitlement } from '../../hooks/useEntitlement';

export default function Clients() {
  const [clients, setClients] = useState(null);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const { caps } = useEntitlement();

  function load() {
    api.get('/clients', { params: { search } }).then((res) => setClients(res.data));
  }

  useEffect(() => { load(); }, [search]);

  async function createClient() {
    setError('');
    try {
      await api.post('/clients', form);
      setOpen(false);
      setForm({ name: '', email: '', phone: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message === 'active_client_cap_reached'
        ? `You've reached your plan's client limit (${caps.activeClients}). Upgrade to add more.`
        : err.response?.data?.message || 'Could not add client');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Clients</h1>
        <Button onClick={() => setOpen(true)}>Add client</Button>
      </div>
      <input
        placeholder="Search by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-line rounded-card px-3 py-2 bg-white mb-4 w-64"
      />
      {!clients ? <Loader /> : <ClientTable clients={clients} />}

      <Modal open={open} onClose={() => setOpen(false)} title="Add a client">
        <div className="space-y-3">
          <input placeholder="Name" className="w-full border border-line rounded-card px-3 py-2" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" className="w-full border border-line rounded-card px-3 py-2" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" className="w-full border border-line rounded-card px-3 py-2" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          {error && <p className="text-clay text-sm">{error}</p>}
          <Button onClick={createClient} className="w-full">Save client</Button>
        </div>
      </Modal>
    </div>
  );
}
