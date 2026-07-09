import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback } from 'react';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const toast = {
        success: (message) => addToast(message, 'success'),
        error: (message) => addToast(message, 'error'),
        info: (message) => addToast(message, 'info'),
        warning: (message) => addToast(message, 'warning')
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            className={`toast toast-${toast.type}`}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, x: 100 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="toast-icon">{getIcon(toast.type)}</span>
                            <span className="toast-message">{toast.message}</span>
                            <button
                                className="toast-close"
                                onClick={() => removeToast(toast.id)}
                            >
                                ✕
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const getIcon = (type) => {
    switch (type) {
        case 'success':
            return '✓';
        case 'error':
            return '✗';
        case 'warning':
            return '⚠';
        default:
            return 'ℹ';
    }
};
