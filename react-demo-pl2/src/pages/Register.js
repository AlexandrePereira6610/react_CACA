import React, { useState } from 'react';
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

            <style jsx>{`
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 20px;
        }
        .register-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 450px;
        }
        .register-card h1 {
          text-align: center;
          margin-bottom: 30px;
          color: #2c3e50;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #34495e;
        }
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }
        .btn-register {
          width: 100%;
          padding: 12px;
          background: #27ae60;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .btn-register:hover {
          background: #219a52;
        }
        .error-message {
          background: #fee;
          color: #c00;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        .login-link {
          text-align: center;
          margin-top: 20px;
        }
        .login-link a {
          color: #3498db;
          text-decoration: none;
        }
      `}</style>
        </motion.div>
    );
}