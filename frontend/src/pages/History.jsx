import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { getToken } from "../utils/auth";
import { Link } from "react-router-dom";

const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const ChevronDownIcon = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20" height="20"
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Yes, Delete", type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{title}</h3>
          <p className="text-gray-500 leading-relaxed mb-8">{message}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-all border border-gray-100 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function History() {
  const [entries, setEntries] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", onConfirm: () => { } });

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    if (token) {
      fetchSymptoms();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchSymptoms = async () => {
    try {
      const res = await axiosInstance.get("/symptoms/");
      setEntries(res.data);
    } catch (err) {
      toast.error("Failed to fetch symptoms.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id, e) => {
    e?.stopPropagation(); // Prevent toggling expansion

    setModalConfig({
      title: "Delete History Item?",
      message: "This action will permanently remove this health check from your records. Are you sure?",
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/symptoms/${id}/`);
          toast.success("Record deleted successfully!");
          setEntries((prev) => prev.filter((entry) => entry.id !== id));
        } catch (err) {
          toast.error("Failed to delete record. Please try again.");
        }
        setModalOpen(false);
      }
    });
    setModalOpen(true);
  };

  const clearAll = () => {
    setModalConfig({
      title: "Clear All History?",
      message: "You are about to delete your entire health check history. This action cannot be undone. Do you wish to proceed?",
      onConfirm: async () => {
        try {
          const res = await axiosInstance.delete("/symptoms/clear-all/");
          if (res.status === 200 || res.status === 204) {
            setEntries([]);
            toast.success(res.data.message || "History cleared successfully!");
          }
        } catch (err) {
          console.error("Clear all failed:", err);
          toast.error("Failed to clear history. Please try again.");
        }
        setModalOpen(false);
      }
    });
    setModalOpen(true);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Authentication Required</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">Please log in to view your health check history.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="flex-1 bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/50 dark:bg-slate-950/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Health Check History</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">View your past symptom checks and health analyses</p>
          </div>
          {entries.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
              Clear All
            </button>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-400 font-medium">Total Checks: <span className="text-gray-900 dark:text-white">{entries.length}</span></p>
        </div>

        {/* Entries List */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 animate-pulse">Loading reports...</div>
        ) : entries.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-20 text-center border-2 border-dashed border-gray-100 dark:border-slate-800">
            <p className="text-gray-400 text-xl">No health checks found yet.</p>
            <Link to="/ai-checker" className="mt-4 inline-block text-blue-600 dark:text-blue-400 font-semibold hover:underline">Perform your first check →</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => {
              const isOpen = expandedId === entry.id;
              const date = new Date(entry.created_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              });
              const time = new Date(entry.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit'
              });

              return (
                <div
                  key={entry.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 border-gray-100 dark:border-slate-800 ${isOpen ? 'shadow-2xl border-blue-100 dark:border-blue-900 scale-[1.01]' : 'shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-slate-700'}`}
                >
                  {/* Collapsed Header */}
                  <div
                    onClick={() => toggleExpand(entry.id)}
                    className="p-6 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-3 rounded-xl ${isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'} transition-colors`}>
                        <ActivityIcon />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                            {entry.patient_name ? `Analysis Case: ${entry.patient_name}` : entry.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${entry.severity === 'HIGH' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                            entry.severity === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
                              'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            }`}>
                            {entry.severity || 'LOW'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                          {date} at {time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => handleDelete(entry.id, e)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                      </button>
                      <ChevronDownIcon isOpen={isOpen} />
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isOpen && (
                    <div className="px-6 pb-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                      {/* Patient Information Grid */}
                      <div className="pt-6 border-t border-gray-50 dark:border-slate-800">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="7" r="4" /></svg>
                          Patient Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="space-y-1 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-50 dark:border-blue-900/20">
                            <p className="text-xs text-blue-400 font-bold uppercase">Patient:</p>
                            <p className="text-lg font-bold text-blue-800 dark:text-blue-300">{entry.patient_name || "Guest"}</p>
                          </div>
                          <div className="space-y-1 bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-50 dark:border-slate-700">
                            <p className="text-xs text-gray-400 font-bold uppercase">Age:</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{entry.age || "N/A"}</p>
                          </div>
                          <div className="space-y-1 bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-50 dark:border-slate-700">
                            <p className="text-xs text-gray-400 font-bold uppercase">Gender:</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{entry.gender || "N/A"}</p>
                          </div>
                          <div className="space-y-1 bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-50 dark:border-slate-700">
                            <p className="text-xs text-gray-400 font-bold uppercase">Duration:</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{entry.duration || 1} {entry.duration === 1 ? 'Day' : 'Days'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Reported Symptoms */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14.5 2 14.5 7.5 20 7.5" /></svg>
                          Reported Symptoms
                        </h4>
                        <div className="bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-50/50 dark:border-blue-900/20 flex flex-wrap gap-2">
                          <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-slate-700">
                            {entry.title}
                          </span>
                          {entry.description && entry.description.split(',').map((s, i) => (
                            <span key={i} className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-slate-700">
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                          Risk Assessment
                        </h4>
                        <div className="bg-yellow-50/30 dark:bg-yellow-900/10 p-8 rounded-2xl border border-yellow-50/50 dark:border-yellow-900/20">
                          <div className="flex justify-between items-end mb-4">
                            <p className="font-bold text-gray-900 dark:text-white">Risk Score</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{entry.risk_score || 0}/100</p>
                          </div>
                          <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${(entry.risk_score || 0) > 70 ? 'bg-red-500' :
                                (entry.risk_score || 0) > 40 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                              style={{ width: `${entry.risk_score || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* AI Consultation Output */}
                      <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-slate-800">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                          AI Consultation Results
                        </h4>
                        <div className="bg-white dark:bg-slate-800 border-2 border-blue-50 dark:border-blue-900/20 p-6 rounded-2xl shadow-sm">
                          {entry.ai_analysis ? (
                            <div className="space-y-3">
                              {entry.ai_analysis.split('\n').map((line, idx) => (
                                <div key={idx} className="flex gap-3">
                                  <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></div>
                                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{line}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 dark:text-gray-500 italic">No AI analysis available for this record.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
