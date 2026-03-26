import { useState } from 'react';
import { Star, Pencil, Trash2, Mail, Phone, Building2, MapPin, StickyNote, MoreVertical } from 'lucide-react';

// ── Avatar colour palettes ────────────────────────────────────────────────────
const GRADIENTS = [
  ['from-violet-500', 'to-purple-600'],
  ['from-blue-500',   'to-cyan-500'],
  ['from-emerald-500','to-teal-600'],
  ['from-pink-500',   'to-rose-500'],
  ['from-orange-500', 'to-amber-500'],
  ['from-indigo-500', 'to-blue-600'],
  ['from-teal-500',   'to-green-600'],
  ['from-red-500',    'to-pink-600'],
];

function pickGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function initials(first = '', last = '') {
  return `${first[0] || ''}${last[0] || ''}`.toUpperCase() || '?';
}

// ── Category styles ───────────────────────────────────────────────────────────
const CAT_BADGE = {
  Work:     'bg-blue-100   text-blue-700   ring-1 ring-blue-200',
  Personal: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
  Family:   'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  Friend:   'bg-pink-100   text-pink-700   ring-1 ring-pink-200',
  Other:    'bg-orange-100 text-orange-600 ring-1 ring-orange-200',
};

const CAT_GLOW = {
  Work:     'shadow-blue-100',
  Personal: 'shadow-violet-100',
  Family:   'shadow-emerald-100',
  Friend:   'shadow-pink-100',
  Other:    'shadow-orange-100',
};

// ── Contact Card ───────────────────────────────────────────────────────────────
export default function ContactCard({ contact, onEdit, onDelete, onToggleFavorite }) {
  const { firstName = '', lastName = '', email, phone, company, address, category, isFavorite, notes } = contact;
  const fullName  = `${firstName} ${lastName}`.trim();
  const [from, to] = pickGradient(fullName || 'default');
  const badge     = CAT_BADGE[category] || CAT_BADGE.Other;
  const glow      = CAT_GLOW[category]  || CAT_GLOW.Other;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className={`group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-100/80 dark:border-slate-700/80 shadow-card hover:shadow-card-hover hover:${glow} transition-all duration-300 overflow-hidden flex flex-col animate-slide-up hover:-translate-y-1`}>

      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Top colour accent strip */}
      <div className={`h-1.5 bg-gradient-to-r ${from} ${to} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* ── Card body ── */}
      <div className="p-5 flex-1">

        {/* Header row: avatar + name + star */}
        <div className="flex items-start gap-3.5 mb-4">
          {/* Avatar with ring */}
          <div className="relative flex-shrink-0">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${from} ${to} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
              <span className="text-white font-black text-xl tracking-tight select-none">
                {initials(firstName, lastName)}
              </span>
            </div>
            {isFavorite && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm animate-bounce-soft">
                <Star size={10} fill="white" stroke="none" />
              </span>
            )}
          </div>

          {/* Name + badge */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[15px] leading-snug truncate">
              {fullName}
            </h3>
            <span className={`mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge}`}>
              {category}
            </span>
          </div>

          {/* Favourite star button */}
          <button
            onClick={() => onToggleFavorite(contact)}
            title={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
            className={`p-1.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
              isFavorite
                ? 'text-amber-400 bg-amber-50  hover:bg-amber-100'
                : 'text-slate-300 hover:text-amber-400 hover:bg-amber-50'
            }`}
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'animate-pop' : ''} />
          </button>
        </div>

        {/* Contact details */}
        <ul className="space-y-2">
          {email && (
            <li className="flex items-center gap-2.5 group/item">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Mail size={12} className="text-indigo-400" />
              </span>
              <a
                href={`mailto:${email}`}
                className="text-sm text-slate-600 truncate hover:text-indigo-600 transition-colors font-medium"
              >
                {email}
              </a>
            </li>
          )}
          {phone && (
            <li className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Phone size={12} className="text-emerald-500" />
              </span>
              <a
                href={`tel:${phone}`}
                className="text-sm text-slate-600 hover:text-emerald-600 transition-colors font-medium"
              >
                {phone}
              </a>
            </li>
          )}
          {company && (
            <li className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Building2 size={12} className="text-blue-400" />
              </span>
              <span className="text-sm text-slate-600 truncate">{company}</span>
            </li>
          )}
          {address && (
            <li className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={12} className="text-rose-400" />
              </span>
              <span className="text-sm text-slate-500 truncate">{address}</span>
            </li>
          )}
          {notes && (
            <li className="flex items-start gap-2.5 pt-1">
              <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <StickyNote size={12} className="text-slate-300" />
              </span>
              <span className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{notes}</span>
            </li>
          )}
        </ul>
      </div>

      {/* ── Footer actions ── */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50/80 dark:from-slate-800/80 to-transparent border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(contact)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600
                     text-slate-600 dark:text-slate-300 text-xs font-semibold
                     hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md hover:-translate-y-0.5
                     active:scale-95 shadow-sm transition-all duration-200"
        >
          <Pencil size={12} className="group-hover/edit:rotate-12 transition-transform duration-200" /> Edit
        </button>
        <button
          onClick={() => onDelete(contact)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600
                     text-slate-600 dark:text-slate-300 text-xs font-semibold
                     hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md hover:-translate-y-0.5
                     active:scale-95 shadow-sm transition-all duration-200"
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </article>
  );
}
