import { motion } from 'framer-motion';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    type = 'button',
    icon,
    loading = false,
    className = ''
}) => {
    const sizeClasses = {
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg'
    };

    return (
        <motion.button
            type={type}
            className={`btn btn-${variant} ${sizeClasses[size]} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
        >
            {loading && (
                <span className="btn-spinner animate-spin">⏳</span>
            )}
            {icon && !loading && <span className="btn-icon">{icon}</span>}
            {children}
        </motion.button>
    );
};

export default Button;
