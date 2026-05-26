import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getProfile } from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar se há token guardado no login
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async (token) => {
        try {
            const userData = await getProfile(token);
            setUser({ ...userData, token });
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setError(null);
        try {
            const response = await apiRegister(userData);
            localStorage.setItem('token', response.token);
            setUser(response);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const login = async (email, password) => {
        setError(null);
        try {
            const response = await apiLogin({ email, password });
            localStorage.setItem('token', response.token);
            setUser(response);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};