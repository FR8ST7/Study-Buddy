import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Plus, FileText, Trash2, Loader2 } from 'lucide-react';
import { dataManager } from '../utils/dataManager';
import { generateSummary, extractKeyPoints, answerQuestion } from '../utils/nlp';

export default function AIDocumentAssistant() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [_, force] = useState(0);
  const documents = useMemo(() => dataManager.getDocuments(), [_, force]);
  const [selectedId, setSelectedId] = useState(null);
  const selected = documents.find(d => d.id === selectedId) || documents[0];
  useEffect(() => { if (!selectedId && documents[0]) setSelectedId(documents[0].id); }, [documents, selectedId]);

  const onPick = () => inputRef.current?.click();

  const readTextFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsText(file);
  });

  const readPdfFile = async (file) => {
    const { getDocument } = await import('pdfjs-dist');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.js');
    // pdfjs-dist v3 sets worker via GlobalWorkerOptions if needed; in CRA, dynamic import suffices
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it) => it.str).join(' ') + '\n';
    }
    return { text, pageCount: pdf.numPages };
  };

  const onFiles = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      let extracted = { text: '', pageCount: 0 };
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        extracted = await readPdfFile(file);
      } else {
        extracted.text = await readTextFile(file);
      }
      const title = file.name.replace(/\.[^.]+$/, '');
      const doc = dataManager.addDocument({
        title,
        fileName: file.name,
        mimeType: file.type || 'text/plain',
        text: extracted.text,
        pageCount: extracted.pageCount
      });
      setSelectedId(doc.id);
      force(x => x + 1);
    } catch (err) {
      setError(err.message || 'Failed to process document');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeDoc = (id) => {
    dataManager.deleteDocument(id);
    force(x => x + 1);
    if (selectedId === id) setSelectedId(null);
  };

  const [qa, setQa] = useState('');
  const [answer, setAnswer] = useState('');
  const [summary, setSummary] = useState('');
  const [points, setPoints] = useState([]);

  const doSummarize = () => {
    if (!selected) return;
    setSummary(generateSummary(selected.text, 3));
    setPoints(extractKeyPoints(selected.text, 5));
  };
  const doAsk = () => {
    if (!selected || !qa.trim()) return;
    setAnswer(answerQuestion(qa, selected.text));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Document Assistant</h1>
        <div className="flex items-center gap-3">
          <input ref={inputRef} type="file" accept=".txt,.md,application/pdf" className="hidden" onChange={onFiles} />
          <button onClick={onPick} className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg neo-shadow" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? 'Processing...' : 'Upload Document'}
          </button>
        </div>
      </div>

      {error && <div className="p-3 border-2 rounded" style={{ borderColor: '#f87171', color: '#b91c1c' }}>{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-4 border-2 rounded-lg neo-shadow" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h2 className="text-lg font-bold mb-3">Your Documents</h2>
          <div className="space-y-2 max-h-[420px] overflow-auto">
            {documents.length === 0 && <p className="text-sm text-gray-500">No documents yet. Upload a PDF or text file.</p>}
            {documents.map(d => (
              <div key={d.id} className={`p-2 border-2 rounded flex items-center justify-between ${selected?.id === d.id ? 'neo-shadow' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
                <button onClick={() => setSelectedId(d.id)} className="flex items-center gap-2 text-left flex-1">
                  <FileText className="w-4 h-4" />
                  <div>
                    <div className="text-sm font-medium">{d.title}</div>
                    <div className="text-xs text-gray-500">{d.mimeType.includes('pdf') ? `${d.pageCount} pages` : 'Text'}</div>
                  </div>
                </button>
                <button onClick={() => removeDoc(d.id)} className="p-2 border-2 rounded" style={{ borderColor: 'var(--border-color)' }} title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 border-2 rounded-lg neo-shadow" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Bot className="w-5 h-5" /> Analyze</h2>
            {!selected && <p className="text-sm text-gray-500">Select or upload a document to analyze.</p>}
            {selected && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button onClick={doSummarize} className="py-2 px-4 border-2 rounded" style={{ borderColor: 'var(--border-color)' }}>Summarize</button>
                  <div className="flex items-center gap-2 flex-1">
                    <input value={qa} onChange={(e) => setQa(e.target.value)} className="flex-1 p-2 border-2 rounded" style={{ borderColor: 'var(--border-color)' }} placeholder="Ask a question about this document" />
                    <button onClick={doAsk} className="py-2 px-4 border-2 rounded" style={{ borderColor: 'var(--border-color)' }}>Ask</button>
                  </div>
                </div>
                {summary && (
                  <div>
                    <h3 className="font-semibold mb-1">Summary</h3>
                    <p className="text-sm whitespace-pre-wrap">{summary}</p>
                  </div>
                )}
                {points.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Key Points</h3>
                    <ul className="list-disc list-inside text-sm">
                      {points.map((p,i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {answer && (
                  <div>
                    <h3 className="font-semibold mb-1">Answer</h3>
                    <p className="text-sm whitespace-pre-wrap">{answer}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {selected && (
            <div className="p-4 border-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h3 className="text-lg font-bold mb-2">{selected.title}</h3>
              <div className="max-h-[300px] overflow-auto text-sm whitespace-pre-wrap">{selected.text.slice(0, 20000)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
