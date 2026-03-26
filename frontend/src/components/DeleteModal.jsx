import { Trash2, X, AlertTriangle } from 'lucide-react';

export default function DeleteModal({ contact, onConfirm, onClose }) {
  const fullName = `${contact?.firstName || ''} ${contact?.lastName || ''}`.trim();

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/60 backdrop-blur-sm animate-fade-in"
      onMouseDown={handleBackdrop}
    >
      <div className="bg-white rounded-3xl shadow-modal w-full max-w-sm animate-scale-in overflow-hidden hover:shadow-2xl transition-shadow duration-300">

        {/* Danger gradient header */}
        <div className="relative bg-gradient-to-r from-red-500 to-rose-600 px-8 pt-8 pb-12 overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-3 left-8 w-16 h-16 bg-black/10 rounded-full" />
          <div className="relative z-10 flex justify-between items-start">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg animate-wiggle">
              <AlertTriangle size={26} className="text-white drop-shadow-md" />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content — slightly pulled up to overlay header */}
        <div className="relative -mt-6 bg-white rounded-t-3xl px-8 pt-7 pb-7 text-center">
          <h2 className="text-xl font-extrabold text-slate-800 mb-2">Delete Contact?</h2>
          <p className="text-slate-500 text-sm mb-1">You're about to permanently delete</p>
          <p className="text-slate-800 font-bold text-base mb-1 truncate px-4">"{fullName}"</p>
          <p className="text-slate-400 text-xs">This action cannot be undone.</p>

          <div className="flex gap-3 mt-7">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                         rounded-xl bg-slate-100 text-slate-600 font-semibold text-sm
                         hover:bg-slate-200 active:scale-95 transition-all duration-200"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                         rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-sm
                         hover:from-red-600 hover:to-rose-700 active:scale-95
                         shadow-md shadow-red-100 hover:shadow-lg hover:shadow-red-200
                         transition-all duration-200"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
