import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalContacts, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end   = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  const btn = (children, onClick, disabled, active = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center min-w-[36px] h-9 px-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95
        ${active
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 animate-fade-in">
      <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
        Showing page <span className="font-bold text-slate-600 dark:text-slate-300">{page}</span> of{' '}
        <span className="font-bold text-slate-600 dark:text-slate-300">{totalPages}</span>
        <span className="mx-1.5">·</span>
        <span className="font-bold text-indigo-500">{totalContacts}</span> contacts total
      </p>

      <div className="flex items-center gap-1.5">
        {btn(<ChevronsLeft size={14} />,  () => onPageChange(1),        page === 1)}
        {btn(<ChevronLeft size={14} />,   () => onPageChange(page - 1), page === 1)}

        {start > 1 && <span className="px-1 text-slate-400">…</span>}
        {pages.map(p => btn(p, () => onPageChange(p), false, p === page))}
        {end < totalPages && <span className="px-1 text-slate-400">…</span>}

        {btn(<ChevronRight size={14} />,  () => onPageChange(page + 1),          page === totalPages)}
        {btn(<ChevronsRight size={14} />, () => onPageChange(totalPages),         page === totalPages)}
      </div>
    </div>
  );
}
