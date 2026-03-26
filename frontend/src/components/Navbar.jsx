import { BookUser, Plus, LogOut, ChevronDown, Moon, Sun, Download, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Navbar({ onAddContact, onExport, onImport }) {
  const { user, logout } = useAuth();
  const { dark, toggle: toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); toast.success('Signed out successfully'); };
  const initials = ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-40">
      <div
        className="relative"
        style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 40%, #a21caf 75%, #db2777 100%)' }}
      >
        {/* Decorative orbs — now animated */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/5 rounded-full animate-pulse-soft" />
          <div className="absolute top-2 right-1/4 w-28 h-28 bg-purple-300/10 rounded-full animate-float" />
          <div className="absolute -bottom-6 right-16 w-20 h-20 bg-pink-400/10 rounded-full animate-float-delayed" />
          <div className="absolute top-0 left-1/2 w-64 h-16 bg-white/[0.03] rounded-full blur-xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[62px]">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white/25 rounded-[13px] blur-[7px]" />
                <div className="relative p-2 bg-white/20 border border-white/25 rounded-[13px] backdrop-blur-sm">
                  <BookUser size={20} className="text-white" />
                </div>
              </div>
              <div className="leading-none">
                <span className="block text-white font-extrabold text-[17px] tracking-tight">ContactHub</span>
                <span className="block text-white/60 text-[11px] font-medium mt-0.5">
                  {getGreeting()}, {user?.firstName || 'there'} 👋
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white
                           transition-all duration-200 active:scale-95"
                title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Export CSV */}
              <button
                onClick={onExport}
                className="hidden sm:flex p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white
                           transition-all duration-200 active:scale-95"
                title="Export contacts as CSV"
              >
                <Download size={16} />
              </button>

              {/* Import CSV */}
              <button
                onClick={onImport}
                className="hidden sm:flex p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white
                           transition-all duration-200 active:scale-95"
                title="Import contacts from CSV"
              >
                <Upload size={16} />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-white/15 mx-1 hidden sm:block" />

              {/* New Contact — shimmer glow */}
              <button
                onClick={onAddContact}
                className="relative flex items-center gap-1.5 bg-white text-indigo-700 font-bold
                           px-4 py-[7px] rounded-xl text-[13px]
                           hover:bg-indigo-50 active:scale-95
                           shadow-lg shadow-black/15 hover:shadow-xl
                           transition-all duration-200 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Plus size={15} strokeWidth={2.8} className="relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline relative z-10">New Contact</span>
                <span className="sm:hidden relative z-10">New</span>
              </button>

              {/* User dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(p => !p)}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20
                             px-2.5 py-[7px] rounded-xl transition-all duration-200 active:scale-95"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/25 border border-white/30 flex items-center justify-center text-white font-extrabold text-[11px]">
                    {initials}
                  </div>
                  <span className="text-white text-[13px] font-semibold hidden md:block max-w-[110px] truncate">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronDown size={13} className={`text-white/60 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden animate-slide-down z-[100]">
                    <div className="px-4 py-3.5 border-b border-slate-100"
                         style={{ background: 'linear-gradient(135deg, #eef2ff, #fdf2f8)' }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xs shadow">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate">{user?.firstName} {user?.lastName}</p>
                          <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
