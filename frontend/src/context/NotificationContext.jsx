import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const showConfirm = useCallback((title, message, onConfirm) => {
    setModal({ title, message, onConfirm });
  }, []);

  const closeConfirm = () => setModal(null);

  const handleConfirm = () => {
    if (modal?.onConfirm) modal.onConfirm();
    setModal(null);
  };

  return (
    <NotificationContext.Provider value={{ showToast, showConfirm }}>
      {children}
      
      {/* Premium Toaster (Stackable) */}
      <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto min-w-[280px] p-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-4 ${
                toast.type === 'error' ? 'bg-white border-red-100' : 
                toast.type === 'success' ? 'bg-white border-green-100' : 
                'bg-white border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                toast.type === 'error' ? 'bg-red-50 text-red-500' : 
                toast.type === 'success' ? 'bg-green-50 text-green-500' : 
                'bg-primary/10 text-primary'
              }`}>
                {toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'ℹ'}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-text-main">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
              onClick={closeConfirm}
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full relative z-10 shadow-premium"
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-3xl mb-6">
                ?
              </div>
              <h3 className="text-2xl font-extrabold text-text-main mb-3">{modal.title}</h3>
              <p className="text-text-secondary font-medium mb-8 leading-relaxed">{modal.message}</p>
              <div className="flex gap-4">
                <button 
                  onClick={closeConfirm}
                  className="flex-1 py-4 bg-slate-100 text-text-main font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
