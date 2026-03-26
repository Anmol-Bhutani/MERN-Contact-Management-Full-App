import { Search, Star, ChevronDown, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['All', 'Work', 'Personal', 'Family', 'Friend', 'Other'];

const CAT_META = {
  All:      { off: 'bg-slate-100/80 text-slate-500 border-slate-200/80 hover:bg-slate-200 hover:text-slate-700',           on: 'bg-slate-800  text-white border-slate-800  shadow-md'       },
  Work:     { off: 'bg-blue-50/80   text-blue-500   border-blue-200/80  hover:bg-blue-100   hover:text-blue-700',           on: 'bg-blue-600   text-white border-blue-600  shadow-md shadow-blue-200'        },
  Personal: { off: 'bg-violet-50/80 text-violet-500 border-violet-200/80 hover:bg-violet-100 hover:text-violet-700',        on: 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200'   },
  Family:   { off: 'bg-emerald-50/80 text-emerald-500 border-emerald-200/80 hover:bg-emerald-100 hover:text-emerald-700',   on: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' },
  Friend:   { off: 'bg-pink-50/80   text-pink-500   border-pink-200/80  hover:bg-pink-100   hover:text-pink-700',           on: 'bg-pink-500   text-white border-pink-500  shadow-md shadow-pink-200'       },
  Other:    { off: 'bg-orange-50/80 text-orange-500 border-orange-200/80 hover:bg-orange-100 hover:text-orange-700',        on: 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'   },
};

const SORT_LABELS = { firstName: 'First Name', lastName: 'Last Name', createdAt: 'Newest First' };

export default function SearchFilterBar({
  searchQuery, onSearchChange,
  selectedCat, onCategoryChange,
  favOnly,     onToggleFav,
  sortBy,      onSortChange,
  categoryCounts,
}) {
  return (
    <div className="glass rounded-2xl p-5 shadow-card border border-white/60 mb-8 space-y-4 animate-slide-up">

      {/* Row 1 — Search + Sort + Favourites */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search bar */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search name, email, phone, company…"
            className="input-field pl-10 pr-9 bg-white/80 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort select — custom styled */}
        <div className="relative shrink-0">
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="input-field appearance-none pr-9 pl-4 cursor-pointer bg-white/80 focus:bg-white min-w-[148px] font-medium text-slate-700"
          >
            {Object.entries(SORT_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Favourites toggle */}
        <button
          onClick={onToggleFav}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold shrink-0 transition-all duration-200 ${
            favOnly
              ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-400 shadow-md shadow-amber-100'
              : 'bg-white/80 text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50'
          }`}
        >
          <Star size={14} fill={favOnly ? 'currentColor' : 'none'} className={favOnly ? 'drop-shadow-sm animate-wiggle' : ''} />
          Favourites
        </button>
      </div>

      {/* Row 2 — Divider + Category pills */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <SlidersHorizontal size={13} className="text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Filter</span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => {
            const active = selectedCat === cat;
            const count = cat === 'All'
              ? Object.values(categoryCounts || {}).reduce((a, b) => a + b, 0)
              : (categoryCounts?.[cat] || 0);
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 hover:-translate-y-0.5 ${
                  active ? CAT_META[cat].on : CAT_META[cat].off
                }`}
              >
                {cat}
                {count > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    active ? 'bg-white/25' : 'bg-black/5 dark:bg-white/10'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
