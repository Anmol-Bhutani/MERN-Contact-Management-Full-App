import { useState } from 'react';
import {
  BookUser, Mail, Lock, User, Eye, EyeOff,
  Loader2, CheckCircle2, Users, Star, Search, LayoutGrid, Shield, Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ── Features for the branding panel ──────────────────────────────────────────
const FEATURES = [
  { icon: Users,      label: 'Organise contacts',          sub: 'Store all your connections in one place'        },
  { icon: Search,     label: 'Search instantly',           sub: 'Find by name, email, phone or company'          },
  { icon: Star,       label: 'Star favourites',            sub: 'Quick access to your most important contacts'   },
  { icon: LayoutGrid, label: 'Smart categories',           sub: 'Work, Personal, Family, Friend & more'          },
  { icon: Shield,     label: 'Secure & private',           sub: 'JWT-protected with per-account isolation'       },
];

const EMPTY = { firstName: '', lastName: '', email: '', password: '', confirm: '' };

// ── Password strength ──────────────────────────────────────────────────────────
function passwordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  const map = [
    { label: 'Very weak', color: 'bg-red-400'    },
    { label: 'Weak',      color: 'bg-orange-400' },
    { label: 'Fair',      color: 'bg-yellow-400' },
    { label: 'Good',      color: 'bg-blue-400'   },
    { label: 'Strong',    color: 'bg-emerald-400' },
    { label: 'Very strong', color: 'bg-emerald-500' },
  ];
  return { score, ...map[Math.min(score, map.length - 1)] };
}

// ── AuthPage ───────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const { login, register } = useAuth();

  const [mode,        setMode]        = useState('login');
  const [form,        setForm]        = useState(EMPTY);
  const [errors,      setErrors]      = useState({});
  const [apiError,    setApiError]    = useState('');
  const [loading,     setLoading]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'A valid email address is required';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (mode === 'register' && form.password !== form.confirm)
      e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back! 👋');
      } else {
        await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
        toast.success('Account created! Welcome to ContactHub 🎉');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => { setMode(m); setForm(EMPTY); setErrors({}); setApiError(''); };

  const strength = mode === 'register' ? passwordStrength(form.password) : null;

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[46%] bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 p-12 xl:p-16 flex-col justify-between relative overflow-hidden">

        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-white/5 rounded-full animate-pulse-soft" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-white/5 rounded-full animate-float-slow" />
          <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-black/10 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-float" />
          <div className="absolute top-20 right-20 w-32 h-32 bg-cyan-500/8 rounded-full blur-xl animate-float-delayed" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-14">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg border border-white/20">
              <BookUser size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-2xl tracking-tight leading-none">ContactHub</h1>
              <p className="text-indigo-300 text-xs font-medium mt-0.5 flex items-center gap-1">
                <Zap size={10} className="text-yellow-300" />
                Smart Contact Manager
              </p>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-white font-black text-4xl xl:text-5xl leading-tight mb-5">
            Your contacts,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              organised perfectly.
            </span>
          </h2>
          <p className="text-indigo-200 text-base mb-12 leading-relaxed max-w-sm">
            One place for all your important connections — searchable, filterable, and always at your fingertips.
          </p>

          {/* Feature list */}
          <ul className="space-y-4 stagger-children">
            {FEATURES.map(({ icon: Icon, label, sub }, i) => (
              <li key={label} className="flex items-center gap-4 group animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                  <Icon size={17} className="text-green-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none mb-0.5">{label}</p>
                  <p className="text-indigo-300/80 text-xs">{sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-indigo-400/60 text-xs">
          © 2026 ContactHub
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-8">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md">
              <BookUser size={22} className="text-white" />
            </div>
            <h1 className="font-black text-2xl text-slate-800 tracking-tight">ContactHub</h1>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100/80 p-8 animate-scale-in relative overflow-hidden">
            {/* Decorative gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />

            {/* Mode toggle */}
            <div className="flex bg-slate-100 rounded-2xl p-1 mb-7">
              {[
                { key: 'login',    label: 'Sign In'        },
                { key: 'register', label: 'Create Account' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => switchMode(key)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    mode === key
                      ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-slate-200/60'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Heading */}
            <h2 className="text-slate-800 font-extrabold text-[1.6rem] leading-tight mb-1">
              {mode === 'login' ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              {mode === 'login'
                ? 'Sign in to access your contacts'
                : 'Join ContactHub and start organising today'}
            </p>

            {/* API error */}
            {apiError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium animate-fade-in flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">⚠️</span>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* Name row (register) */}
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3 animate-slide-up">
                  <div>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)}
                        placeholder="First name *"
                        className={`input-field pl-9 text-sm ${errors.firstName ? 'input-field-error' : ''}`}
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.firstName}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)}
                        placeholder="Last name"
                        className="input-field pl-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="Email address" autoComplete="email"
                    className={`input-field pl-9 text-sm ${errors.email ? 'input-field-error' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Password (min 6 characters)"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className={`input-field pl-9 pr-11 text-sm ${errors.password ? 'input-field-error' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)} tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.password}</p>}
                {/* Strength meter */}
                {mode === 'register' && form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : 'bg-slate-100'
                        }`} />
                      ))}
                    </div>
                    <p className={`text-[11px] font-medium ${
                      strength.score <= 2 ? 'text-red-400' : strength.score <= 3 ? 'text-yellow-500' : 'text-emerald-500'
                    }`}>{strength.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm password (register) */}
              {mode === 'register' && (
                <div className="animate-slide-up">
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input type={showConfirm ? 'text' : 'password'} value={form.confirm}
                      onChange={e => set('confirm', e.target.value)}
                      placeholder="Confirm password" autoComplete="new-password"
                      className={`input-field pl-9 pr-11 text-sm ${errors.confirm ? 'input-field-error' : ''}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10">
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirm && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.confirm}</p>}
                  {form.confirm && form.password === form.confirm && (
                    <p className="text-emerald-500 text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 size={12} /> Passwords match
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="btn-primary w-full py-3 text-[15px] mt-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" />
                    {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : mode === 'login' ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>

            {/* Switch mode link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-indigo-600 font-bold hover:underline underline-offset-2"
              >
                {mode === 'login' ? 'Create one →' : 'Sign in →'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
