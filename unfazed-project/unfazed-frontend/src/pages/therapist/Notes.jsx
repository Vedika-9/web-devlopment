import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import NoteEditor from '../../components/notes/NoteEditor';
import { useEntitlement } from '../../hooks/useEntitlement';

export default function Notes() {
  const [clients, setClients] = useState(null);
  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState([]);
  const [format, setFormat] = useState('freeform');
  const [type, setType] = useState('private');
  const [note, setNote] = useState({});
  const { canAccess } = useEntitlement();

  useEffect(() => {
    api.get('/clients').then((res) => {
      setClients(res.data);
      if (res.data[0]) setClientId(res.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!clientId) return;
    api.get(`/notes/therapist/${clientId}`).then((res) => setNotes(res.data));
  }, [clientId]);

  async function saveNote() {
    const content = format === 'freeform' ? note.text : note;
    const res = await api.post('/notes', { clientId, type, format, content });
    setNotes([res.data, ...notes]);
    setNote({});
  }

  if (!clients) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl mb-6">Clinical notes</h1>

      <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="border border-line rounded-card px-3 py-2 bg-white mb-6">
        {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      <div className="border border-line rounded-card bg-white p-5 mb-8">
        <div className="flex gap-4 mb-4 text-sm">
          <label className="flex items-center gap-2">
            <span>Visibility:</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="border border-line rounded-card px-2 py-1">
              <option value="private">Private (therapist only)</option>
              <option value="shared">Shared (visible to client)</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span>Format:</span>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="border border-line rounded-card px-2 py-1">
              <option value="freeform">Freeform</option>
              <option value="soap" disabled={!canAccess('note_template:soap')}>SOAP {!canAccess('note_template:soap') && '(upgrade required)'}</option>
              <option value="dap" disabled={!canAccess('note_template:dap')}>DAP {!canAccess('note_template:dap') && '(upgrade required)'}</option>
            </select>
          </label>
        </div>
        <NoteEditor note={note} setNote={setNote} format={format} />
        <Button onClick={saveNote} className="mt-3">Save note</Button>
      </div>

      <h2 className="font-serif text-lg mb-3">History</h2>
      <ul className="space-y-3">
        {notes.map((n) => (
          <li key={n._id} className="border border-line rounded-card bg-white p-4 text-sm">
            <div className="flex justify-between text-ink/50 text-xs mb-2">
              <span className="uppercase">{n.type} · {n.format}</span>
              <span>{new Date(n.createdAt).toLocaleString()}</span>
            </div>
            <pre className="whitespace-pre-wrap font-sans">{typeof n.content === 'string' ? n.content : JSON.stringify(n.content, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
