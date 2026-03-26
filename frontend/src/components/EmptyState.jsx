import { UserPlus, SearchX, Sparkles, Zap, Globe } from 'lucide-react';

export default function EmptyState({ onAddContact, searchQuery }) {

  /* ── No search results ── */
  if (searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-inner">
            <SearchX size={36} className="text-slate-400" />
          </div>
        </div>
        <h3 className="text-slate-700 font-extrabold text-xl mb-2">No results found</h3>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
          No contacts match&nbsp;
          <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
            "{searchQuery}"
          </span>.
          <br />Try a different search term or clear filters.
        </p>
      </div>
    );
  }

  /* ── Truly empty ── */
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-in relative">
      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-3 h-3 bg-indigo-300/30 rounded-full animate-float-slow" />
        <div className="absolute top-20 right-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-float-delayed" />
        <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-pink-300/20 rounded-full animate-pulse-soft" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-amber-400/30 rounded-full animate-float" />
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-cyan-300/20 rounded-full animate-float-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating animated icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-[2rem] flex items-center justify-center shadow-lg animate-float">
          <UserPlus size={44} className="text-indigo-500" />
        </div>
        {/* Orbiting sparkle */}
        <span className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-md animate-bounce-soft">
          <Sparkles size={14} className="text-white" />
        </span>
        {/* Extra orbiting icons */}
        <span className="absolute -bottom-1 -left-3 w-7 h-7 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md animate-float-delayed">
          <Zap size={12} className="text-white" />
        </span>
        <span className="absolute top-1/2 -right-5 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md animate-pulse-soft">
          <Globe size={10} className="text-white" />
        </span>
      </div>

      <h3 className="font-black text-3xl mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        No contacts yet
      </h3>
      <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
        Get started by adding your first contact. Keep all your important connections organised in one place — searchable, sorted, always at your fingertips.
      </p>
      <button
        onClick={onAddContact}
        className="btn-primary text-sm px-8 py-3.5 animate-pop"
      >
        <UserPlus size={17} />
        Add Your First Contact
      </button>
    </div>
  );
}
