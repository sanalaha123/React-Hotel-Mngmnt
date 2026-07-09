import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const sizeClasses = {
        sm: 'modal-sm',
        md: 'modal-md',
        lg: 'modal-lg',
        xl: 'modal-xl'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <div className="modal-container">
                        <motion.div
                            className={`modal-content ${sizeClasses[size]}`}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {title && (
                                <div className="modal-header">
                                    <h3>{title}</h3>
                                    <button className="modal-close" onClick={onClose}>
                                        ✕
                                    </button>
                                </div>
                            )}
                            <div className="modal-body">{children}</div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
