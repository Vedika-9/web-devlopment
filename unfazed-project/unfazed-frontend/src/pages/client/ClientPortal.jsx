import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Loader from '../../components/common/Loader';
import ChatWindow from '../../components/chat/ChatWindow';

// clientId is passed via the branded link the therapist shares directly with
// that client (e.g. after booking); a production build would issue a signed
// access token instead of a raw id.
export default function ClientPortal() {
  const { clientId } = useParams();
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    api.get(`/notes/client-portal/${clientId}`).then((res) => setNotes(res.data));
  }, [clientId]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl mb-6">Your portal</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-serif text-lg mb-3">Shared notes</h2>
          {!notes ? <Loader /> : notes.length === 0 ? (
            <p className="text-sm text-ink/50">Nothing shared yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n._id} className="border border-line rounded-card bg-white p-4 text-sm">
                  <p className="text-ink/50 text-xs mb-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                  <pre className="whitespace-pre-wrap font-sans">{typeof n.content === 'string' ? n.content : JSON.stringify(n.content, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="font-serif text-lg mb-3">Message your therapist</h2>
          <ChatWindow roomId={`client-${clientId}`} role="client" clientId={clientId} />
        </div>
      </div>
    </div>
  );
}
