import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import MessageBubble from './MessageBubble';

// role: 'therapist' | 'client'; roomId should be stable per (therapistId, clientId) pair
export default function ChatWindow({ roomId, role, token, clientId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: role === 'therapist' ? { role, token } : { role, clientId },
    });
    socketRef.current = socket;
    socket.emit('join_room', { roomId });
    socket.on('receive_message', (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.disconnect();
  }, [roomId]);

  function send() {
    if (!text.trim()) return;
    socketRef.current.emit('send_message', { roomId, message: text });
    setText('');
  }

  return (
    <div className="border border-line rounded-card bg-white flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} isOwn={m.senderRole === role} />
        ))}
      </div>
      <div className="border-t border-line p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message…"
          className="flex-1 border border-line rounded-card px-3 py-2 text-sm"
        />
        <button onClick={send} className="bg-moss-600 text-white px-4 rounded-card text-sm">Send</button>
      </div>
    </div>
  );
}
