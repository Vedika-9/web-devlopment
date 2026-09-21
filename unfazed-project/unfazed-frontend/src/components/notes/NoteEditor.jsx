export default function NoteEditor({ note, setNote, format }) {
  if (format === 'soap') {
    return (
      <div className="space-y-2">
        {['subjective', 'objective', 'assessment', 'plan'].map((field) => (
          <div key={field}>
            <label className="text-xs uppercase text-ink/50">{field}</label>
            <textarea
              className="w-full border border-line rounded-card px-3 py-2 text-sm"
              rows={2}
              value={note[field] || ''}
              onChange={(e) => setNote({ ...note, [field]: e.target.value })}
            />
          </div>
        ))}
      </div>
    );
  }
  if (format === 'dap') {
    return (
      <div className="space-y-2">
        {['data', 'assessment', 'plan'].map((field) => (
          <div key={field}>
            <label className="text-xs uppercase text-ink/50">{field}</label>
            <textarea
              className="w-full border border-line rounded-card px-3 py-2 text-sm"
              rows={2}
              value={note[field] || ''}
              onChange={(e) => setNote({ ...note, [field]: e.target.value })}
            />
          </div>
        ))}
      </div>
    );
  }
  return (
    <textarea
      className="w-full border border-line rounded-card px-3 py-2 text-sm"
      rows={6}
      placeholder="Write a freeform note…"
      value={note.text || ''}
      onChange={(e) => setNote({ ...note, text: e.target.value })}
    />
  );
}
