import React, { useMemo, useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { dataManager } from '../utils/dataManager';

export default function QuickReference() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [_, force] = useState(0);

  const references = useMemo(() => dataManager.getQuickReferences(), [_, force]);

  const addRef = (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() && !content.trim()) { setError('Add a title or content'); return; }
    dataManager.addQuickReference({ title, content, tags });
    setTitle('');
    setContent('');
    setTags('');
    force(x => x + 1);
  };

  const removeRef = (id) => {
    dataManager.deleteQuickReference(id);
    force(x => x + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quick Reference</h1>
      </div>

      <form onSubmit={addRef} className="p-4 border-2 rounded-lg space-y-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <h2 className="text-lg font-semibold">Add Reference</h2>
        {error && <div className="p-3 border-2 rounded" style={{ borderColor: '#f87171', color: '#b91c1c' }}>{error}</div>}
        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 border-2 rounded-lg"
          style={{ borderColor: 'var(--border-color)' }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="w-full p-3 border-2 rounded-lg"
          style={{ borderColor: 'var(--border-color)' }}
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full p-3 border-2 rounded-lg"
          style={{ borderColor: 'var(--border-color)' }}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 border-2 rounded-lg neo-shadow" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <span className="inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add</span>
        </button>
      </form>

      <div className="space-y-3">
        {references.length === 0 && (
          <div className="p-6 border-2 rounded-lg neo-shadow" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText className="w-5 h-5" /> No references yet</h2>
            <p className="text-sm">Add your first quick reference using the form above.</p>
          </div>
        )}
        {references.map(ref => (
          <div key={ref.id} className="p-4 border-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{ref.title}</h3>
                {ref.tags?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {ref.tags.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-1 border rounded" style={{ borderColor: 'var(--border-color)' }}>#{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => removeRef(ref.id)} className="p-2 border-2 rounded neo-shadow-small" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {ref.content && <p className="mt-3 whitespace-pre-wrap text-sm">{ref.content}</p>}
            <p className="mt-2 text-xs text-gray-500">Added {new Date(ref.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
