import { useState, useEffect, useCallback } from 'react';
import { contactsApi } from './services/api';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import { BookUser } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar          from './components/Navbar';
import StatsBar        from './components/StatsBar';
import SearchFilterBar from './components/SearchFilterBar';
import ContactCard     from './components/ContactCard';
import ContactModal    from './components/ContactModal';
import DeleteModal     from './components/DeleteModal';
import EmptyState      from './components/EmptyState';
import Pagination      from './components/Pagination';
import ImportModal     from './components/ImportModal';

// ── Skeleton loading grid ──────────────────────────────────────────────────────
function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-card border border-slate-100/80 dark:border-slate-700/80 overflow-hidden animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
          {/* Shimmer sweep */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded-full w-3/4" />
              <div className="h-3 bg-slate-100 rounded-full w-1/3" />
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="h-3 bg-slate-100 rounded-full w-full" />
            <div className="h-3 bg-slate-100 rounded-full w-5/6" />
            <div className="h-3 bg-slate-100 rounded-full w-4/6" />
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end gap-2">
            <div className="h-8 bg-slate-100 rounded-xl w-16" />
            <div className="h-8 bg-slate-100 rounded-xl w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Full-page token-validation loader ─────────────────────────────────────────
function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-delayed" />
      <div className="text-center relative z-10">
        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl animate-float">
          <BookUser size={36} className="text-white" />
        </div>
        <p className="text-white font-bold text-xl tracking-wide">ContactHub</p>
        <p className="text-indigo-200 text-sm mt-1">Loading your workspace…</p>
        <div className="flex gap-1.5 justify-center mt-4">
          <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [contacts,        setContacts]        = useState([]);
  const [stats,           setStats]           = useState({ total: 0, favorites: 0, categoriesUsed: 0, categoryCounts: {} });
  const [pagination,      setPagination]      = useState({ page: 1, totalPages: 1, totalContacts: 0 });
  const [loading,         setLoading]         = useState(true);
  const [searchQuery,     setSearchQuery]     = useState('');
  const [selectedCat,     setSelectedCat]     = useState('All');
  const [favOnly,         setFavOnly]         = useState(false);
  const [sortBy,          setSortBy]          = useState('firstName');
  const [page,            setPage]            = useState(1);

  const [showModal,       setShowModal]       = useState(false);
  const [editingContact,  setEditingContact]  = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete,        setToDelete]        = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // ── Fetch with debounce ──────────────────────────────────────────────────────
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { sort: sortBy, page, limit: 9 };
      if (searchQuery)      params.search   = searchQuery;
      if (selectedCat !== 'All') params.category = selectedCat;
      if (favOnly)          params.favorite = 'true';

      const { data } = await contactsApi.getAll(params);
      setContacts(data.contacts);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load contacts. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCat, favOnly, sortBy, page]);

  useEffect(() => {
    const timer = setTimeout(fetchContacts, 300);
    return () => clearTimeout(timer);
  }, [fetchContacts]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const openAdd  = () => { setEditingContact(null); setShowModal(true); };
  const openEdit = (c)  => { setEditingContact(c);   setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingContact(null); };

  const openDelete  = (c) => { setToDelete(c); setShowDeleteModal(true); };
  const closeDelete = ()  => { setToDelete(null); setShowDeleteModal(false); };

  const handleSave = async (formData) => {
    try {
      if (editingContact) {
        await contactsApi.update(editingContact._id, formData);
        toast.success('Contact updated successfully!');
      } else {
        await contactsApi.create(formData);
        toast.success('Contact added successfully!');
      }
      closeModal();
      fetchContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save contact.');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await contactsApi.remove(toDelete._id);
      toast.success('Contact deleted.');
      closeDelete();
      fetchContacts();
    } catch {
      toast.error('Failed to delete contact.');
    }
  };

  const handleToggleFavorite = async (contact) => {
    try {
      await contactsApi.toggleFavorite(contact._id);
      fetchContacts();
    } catch {
      toast.error('Failed to update favourite.');
    }
  };

  // ── Export CSV ──────────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      const { data } = await contactsApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Contacts exported!');
    } catch {
      toast.error('Failed to export contacts.');
    }
  };

  // ── Import CSV ──────────────────────────────────────────────────────────────
  const handleImport = async (csvText) => {
    const { data } = await contactsApi.importCsv(csvText);
    toast.success(data.message);
    setShowImportModal(false);
    setPage(1);
    fetchContacts();
    return data;
  };

  // ── Reset page when filters change ────────────────────────────────────────
  const handleSearchChange   = (v) => { setSearchQuery(v); setPage(1); };
  const handleCatChange      = (v) => { setSelectedCat(v); setPage(1); };
  const handleToggleFavOnly  = ()  => { setFavOnly(p => !p); setPage(1); };
  const handleSortChange     = (v) => { setSortBy(v); setPage(1); };

  // ── Auth guard (all hooks must run before this) ─────────────────────────────
  const { user, isLoading: authLoading } = useAuth();
  if (authLoading) return <FullPageLoader />;
  if (!user)       return <AuthPage />;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen page-bg flex flex-col">
      <Navbar onAddContact={openAdd} onExport={handleExport} onImport={() => setShowImportModal(true)} />

      {/* Decorative background blobs — fixed behind content */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-400/[.07] rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-purple-400/[.07] rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-pink-400/[.06] rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-2/3 left-10 w-[200px] h-[200px] bg-cyan-400/[.05] rounded-full blur-2xl animate-float" />
        <div className="absolute top-20 right-1/3 w-[180px] h-[180px] bg-amber-300/[.05] rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <StatsBar stats={stats} contactCount={contacts.length} />

        <SearchFilterBar
          searchQuery={searchQuery}   onSearchChange={handleSearchChange}
          selectedCat={selectedCat}   onCategoryChange={handleCatChange}
          favOnly={favOnly}           onToggleFav={handleToggleFavOnly}
          sortBy={sortBy}             onSortChange={handleSortChange}
          categoryCounts={stats.categoryCounts}
        />

        {loading ? (
          <LoadingGrid />
        ) : contacts.length === 0 ? (
          <EmptyState onAddContact={openAdd} searchQuery={searchQuery} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in stagger-children">
              {contacts.map(contact => (
                <ContactCard
                  key={contact._id}
                  contact={contact}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalContacts={pagination.totalContacts}
              onPageChange={setPage}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-indigo-100/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 <span className="font-bold text-indigo-500">ContactHub</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </footer>

      {showModal && (
        <ContactModal
          contact={editingContact}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {showDeleteModal && toDelete && (
        <DeleteModal
          contact={toDelete}
          onConfirm={handleConfirmDelete}
          onClose={closeDelete}
        />
      )}

      {showImportModal && (
        <ImportModal
          onImport={handleImport}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
}
