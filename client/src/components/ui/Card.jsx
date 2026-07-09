import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ children, className = '', hover = true, glass = false }) => {
    const cardClass = glass ? 'glass-card' : 'card';

    return (
        <motion.div
            className={`${cardClass} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' } : {}}
        >
            {children}
        </motion.div>
    );
};

export default Card;
