import { motion } from 'framer-motion';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'spinner-sm',
        md: 'spinner-md',
        lg: 'spinner-lg'
    };

    return (
        <div className={`spinner-container ${className}`}>
            <motion.div
                className={`spinner ${sizeClasses[size]}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
                <div className="spinner-inner"></div>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;
