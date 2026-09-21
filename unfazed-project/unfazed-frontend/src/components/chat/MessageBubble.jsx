export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-xs px-3 py-2 rounded-card text-sm ${isOwn ? 'bg-moss-600 text-white' : 'bg-white border border-line'}`}>
        {message.message}
      </div>
    </div>
  );
}
