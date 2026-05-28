import React, { useState } from 'react';
import './Register.css';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [localError, setLocalError] = useState('');
    const { register, error } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (formData.password !== formData.confirmPassword) {
            setLocalError('As passwords não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setLocalError('A password deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            window.location.href = '/';
        } catch (err) {
            setLocalError(err.message || 'Erro ao registar');
        }
    };

    return (
        <motion.div
            className="register-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="register-card">
                <h1>📝 Criar Conta</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Seu nome completo"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="exemplo@email.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Repita a password"
                        />
                    </div>
                    {(localError || error) && (
                        <div className="error-message">❌ {localError || error}</div>
                    )}
                    <button type="submit" className="btn-register">
                        Registar
                    </button>
                </form>
                <p className="login-link">
                    Já tem conta? <a href="/login">Faça login</a>
                </p>
            </div>
        </motion.div>
    );
}