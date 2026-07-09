import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/');
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <motion.div
                    className="auth-card glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join LuxuryStay today</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your name"
                            icon={<FaUser />}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                            icon={<FaEnvelope />}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="At least 6 characters"
                            icon={<FaLock />}
                            required
                        />

                        <div className="input-group">
                            <label className="input-label">Account Type</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="select"
                            >
                                <option value="user">Customer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="auth-submit"
                            loading={loading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <p className="auth-footer">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
