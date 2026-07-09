import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            toast.success('Logged in successfully!');
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
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to your account</p>

                    <form onSubmit={handleSubmit} className="auth-form">
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
                            placeholder="Enter your password"
                            icon={<FaLock />}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="auth-submit"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Sign up here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
