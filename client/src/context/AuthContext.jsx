import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });

            setUser(data.data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);

            setUser(data.data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const updateProfile = async (userData) => {
        try {
            const { data } = await api.put('/auth/profile', userData);
            setUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed'
            };
        }
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const isAuthenticated = () => {
        return !!user;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
