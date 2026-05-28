import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { login, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        try {
            await login(email, password);
            window.location.href = '/';
        } catch (err) {
            setLocalError(err.message || 'Erro ao fazer login');
        }
    };

    return (
        <motion.div
            className="login-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="login-card">
                <h1>🔐 Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="exemplo@email.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="********"
                        />
                    </div>
                    {(localError || error) && (
                        <div className="error-message">❌ {localError || error}</div>
                    )}
                    <button type="submit" className="btn-login">
                        Entrar
                    </button>
                </form>
                <p className="register-link">
                    Não tem conta? <a href="/register">Registe-se</a>
                </p>
            </div>
        </motion.div>
    );
}