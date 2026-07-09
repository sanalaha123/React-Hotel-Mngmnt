import { useState } from 'react';
import { motion } from 'framer-motion';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    required = false,
    disabled = false,
    icon,
    className = '',
    name
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`input-group ${className}`}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="text-error"> *</span>}
                </label>
            )}
            <div className="input-wrapper">
                {icon && <span className="input-icon-left">{icon}</span>}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`input ${icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''}`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </div>
            {error && (
                <motion.span
                    className="input-error-message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {error}
                </motion.span>
            )}
        </div>
    );
};

export default Input;
