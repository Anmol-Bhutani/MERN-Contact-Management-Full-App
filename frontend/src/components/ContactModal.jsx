import { useState, useEffect } from 'react';
import {
  X, User, Mail, Phone, Building2,
  MapPin, Tag, FileText, Star, Loader2, Sparkles,
} from 'lucide-react';

const CATEGORIES = ['Work', 'Personal', 'Family', 'Friend', 'Other'];

const CAT_META = {
  Work:     { on: 'bg-blue-600   text-white border-blue-600   shadow-sm shadow-blue-100',  off: 'bg-blue-50/80   text-blue-500   border-blue-200   hover:bg-blue-100'   },
  Personal: { on: 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-100',off: 'bg-violet-50/80 text-violet-500 border-violet-200 hover:bg-violet-100' },
  Family:   { on: 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-100',off:'bg-emerald-50/80 text-emerald-500 border-emerald-200 hover:bg-emerald-100'},
  Friend:   { on: 'bg-pink-500   text-white border-pink-500   shadow-sm shadow-pink-100',  off: 'bg-pink-50/80   text-pink-500   border-pink-200   hover:bg-pink-100'   },
  Other:    { on: 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-100',off: 'bg-orange-50/80 text-orange-500 border-orange-200 hover:bg-orange-100' },
};

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  company: '', address: '', category: 'Other', notes: '', isFavorite: false,
};

// ── Section divider ────────────────────────────────────────────────────────────
function Section({ label }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

// ── Labelled field ─────────────────────────────────────────────────────────────
function Field({ icon: Icon, label, required, children }) {
  return (
    <div>
      <label className="relative z-10 flex items-center gap-1.5 mb-1.5">
        <Icon size={12} className="text-slate-400" />
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </span>
      </label>
      {children}
    </div>
  );
}

// ── ContactModal ───────────────────────────────────────────────────────────────
export default function ContactModal({ contact, onSave, onClose }) {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isEdit = !!contact;

  useEffect(() => {
    if (contact) {
      setForm({
        firstName:  contact.firstName  || '',
        lastName:   contact.lastName   || '',
        email:      contact.email      || '',
        phone:      contact.phone      || '',
        company:    contact.company    || '',
        address:    contact.address    || '',
        category:   contact.category   || 'Other',
        notes:      contact.notes      || '',
        isFavorite: contact.isFavorite || false,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [contact]);

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Invalid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4
                 bg-black/60 backdrop-blur-sm animate-fade-in"
      onMouseDown={handleBackdrop}
    >
      <div className="bg-white w-full sm:rounded-3xl sm:max-w-2xl max-h-[96vh] sm:max-h-[90vh] overflow-hidden animate-slide-in-right flex flex-col shadow-modal rounded-t-3xl">

        {/* ── Header ── */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-7 py-6 flex-shrink-0 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full animate-pulse-soft" />
          <div className="absolute -bottom-4 left-1/3 w-20 h-20 bg-black/10 rounded-full animate-float-slow" />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-float-delayed" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm animate-glow-pulse">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-extrabold text-lg leading-none">
                  {isEdit ? 'Edit Contact' : 'Add New Contact'}
                </h2>
                <p className="text-indigo-200 text-xs mt-1">
                  {isEdit ? 'Update the contact details below' : 'Fill in details to save a new contact'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-7 py-6 space-y-5 stagger-children">

            <Section label="Basic Information" />

            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={User} label="First Name" required>
                <input
                  type="text" value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  placeholder="John"
                  className={`input-field ${errors.firstName ? 'input-field-error' : ''}`}
                />
                {errors.firstName && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.firstName}</p>}
              </Field>
              <Field icon={User} label="Last Name">
                <input
                  type="text" value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  placeholder="Doe"
                  className="input-field"
                />
              </Field>
            </div>

            <Section label="Contact Details" />

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={Mail} label="Email Address">
                <input
                  type="email" value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="john@example.com"
                  className={`input-field ${errors.email ? 'input-field-error' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>}
              </Field>
              <Field icon={Phone} label="Phone Number">
                <input
                  type="tel" value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
              </Field>
            </div>

            {/* Company + Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={Building2} label="Company / Organisation">
                <input
                  type="text" value={form.company}
                  onChange={e => set('company', e.target.value)}
                  placeholder="INGLU Global"
                  className="input-field"
                />
              </Field>
              <Field icon={MapPin} label="City / Address">
                <input
                  type="text" value={form.address}
                  onChange={e => set('address', e.target.value)}
                  placeholder="New Delhi, India"
                  className="input-field"
                />
              </Field>
            </div>

            <Section label="Preferences" />

            {/* Category + Favourite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={Tag} label="Category">
                <div className="flex flex-wrap gap-2 mt-1">
                  {CATEGORIES.map(cat => (
                    <button
                      type="button" key={cat}
                      onClick={() => set('category', cat)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 active:scale-95 ${
                        form.category === cat ? CAT_META[cat].on : CAT_META[cat].off
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </Field>

              <Field icon={Star} label="Mark as Favourite">
                <button
                  type="button"
                  onClick={() => set('isFavorite', !form.isFavorite)}
                  className={`mt-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95 w-full justify-center ${
                    form.isFavorite
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-400 shadow-md shadow-amber-100'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-500'
                  }`}
                >
                  <Star size={14} fill={form.isFavorite ? 'currentColor' : 'none'} />
                  {form.isFavorite ? 'Saved as Favourite ✓' : 'Add to Favourites'}
                </button>
              </Field>
            </div>

            <Section label="Notes" />

            {/* Notes */}
            <Field icon={FileText} label="Additional Notes">
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Any additional notes about this contact…"
                rows={3}
                maxLength={500}
                className="input-field resize-none"
              />
              <p className={`text-[11px] mt-1 text-right font-medium ${form.notes.length > 450 ? 'text-orange-400' : 'text-slate-300'}`}>
                {form.notes.length}/500
              </p>
            </Field>
          </div>

          {/* ── Footer ── */}
          <div className="px-7 py-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary min-w-[140px]">
              {saving
                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                : isEdit ? 'Save Changes' : 'Add Contact'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
