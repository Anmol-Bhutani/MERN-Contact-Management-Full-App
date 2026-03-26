import { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ImportModal({ onImport, onClose }) {
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setResult({ error: 'Please select a .csv file' });
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(ev.target.result);
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!csvText.trim()) return;
    setImporting(true);
    setResult(null);
    try {
      const res = await onImport(csvText);
      setResult({ success: res.message || `${res.count} contacts imported` });
    } catch (err) {
      setResult({ error: err.response?.data?.message || 'Import failed' });
    } finally {
      setImporting(false);
    }
  };

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onMouseDown={handleBackdrop}
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-modal animate-scale-in overflow-hidden">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-7 py-6 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Upload size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-extrabold text-lg leading-none">Import Contacts</h2>
                <p className="text-emerald-200 text-xs mt-1">Upload a CSV file to bulk-add contacts</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            CSV must include a <strong>"First Name"</strong> column. Optional columns: Last Name, Email, Phone, Company, Address, Category, Notes, Favourite.
          </p>

          {/* File picker */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center cursor-pointer
                       hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all"
          >
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
            <FileText size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            {fileName ? (
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{fileName}</p>
            ) : (
              <p className="text-sm text-slate-400">Click to select a <strong>.csv</strong> file</p>
            )}
          </div>

          {/* Or paste */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Or paste CSV text</label>
            <textarea
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder={'First Name,Last Name,Email,Phone,Category\nJohn,Doe,john@example.com,9876543210,Work'}
              rows={4}
              className="input-field resize-none mt-1.5 text-xs font-mono"
            />
          </div>

          {/* Result message */}
          {result?.success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-medium">
              <CheckCircle2 size={16} /> {result.success}
            </div>
          )}
          {result?.error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle size={16} /> {result.error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!csvText.trim() || importing}
            className="btn-primary min-w-[140px]"
          >
            {importing ? <><Loader2 size={14} className="animate-spin" /> Importing…</> : 'Import Contacts'}
          </button>
        </div>
      </div>
    </div>
  );
}
