import { useState, useEffect } from 'react';
import { Users, Star, LayoutGrid, Eye } from 'lucide-react';

const ITEMS = [
  {
    key: 'total', label: 'Total Contacts', sub: 'in your hub',
    icon: Users,
    bg: 'from-blue-500 to-cyan-500', ring: 'ring-blue-100/80',
    num: 'text-blue-600', accent: '#3b82f6',
  },
  {
    key: 'favorites', label: 'Starred', sub: 'marked as favourite',
    icon: Star,
    bg: 'from-amber-400 to-orange-500', ring: 'ring-amber-100/80',
    num: 'text-amber-500', accent: '#f59e0b',
  },
  {
    key: 'categoriesUsed', label: 'Categories', sub: 'types in use',
    icon: LayoutGrid,
    bg: 'from-violet-500 to-purple-600', ring: 'ring-violet-100/80',
    num: 'text-violet-600', accent: '#8b5cf6',
  },
  {
    key: 'contactCount', label: 'Showing', sub: 'matching results',
    icon: Eye,
    bg: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-100/80',
    num: 'text-emerald-600', accent: '#10b981',
  },
];

// Animated counter hook
function useAnimatedCount(target) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const duration = 600;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
}

function StatCard({ item, value, index }) {
  const { label, sub, icon: Icon, bg, ring, num } = item;
  const animVal = useAnimatedCount(value);
  return (
    <div
      className={`card p-5 ring-1 ${ring} group cursor-default animate-slide-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] truncate">{label}</p>
          <p className={`text-[2.2rem] font-black mt-1 leading-none ${num} transition-all duration-300 tabular-nums`}>
            {animVal}
          </p>
          <p className="text-[11px] text-slate-300 dark:text-slate-500 font-medium mt-1.5 truncate">{sub}</p>
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${bg} shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}>
          <Icon size={19} className="text-white" />
        </div>
      </div>

      {/* Animated progress bar */}
      <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${bg} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(100, value * 5 + 10)}%` }}
        />
      </div>
    </div>
  );
}

export default function StatsBar({ stats, contactCount }) {
  const values = { ...stats, contactCount };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {ITEMS.map((item, i) => (
        <StatCard key={item.key} item={item} value={values[item.key] ?? 0} index={i} />
      ))}
    </div>
  );
}

