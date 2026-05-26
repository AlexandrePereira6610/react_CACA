import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, getProfile } from '../services/api';
import { motion } from 'framer-motion';

export default function Profile() {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        institution: '',
        profilePicture: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]);

    const loadUserData = async () => {
        try {
            const data = await getProfile(localStorage.getItem('token'));
            setFormData({
                name: data.name || '',
                phone: data.phone || '',
                institution: data.institution || '',
                profilePicture: data.profilePicture || ''
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await updateProfile(localStorage.getItem('token'), formData);
            setMessage('✅ Perfil atualizado com sucesso!');
            setIsEditing(false);
        } catch (err) {
            setMessage('❌ Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="profile-container">Carregando...</div>;
    }

    return (
        <motion.div
            className="profile-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-icon">👤</div>
                    <h1>Meu Perfil</h1>
                    <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
            {user.role === 'admin' ? 'Administrador' : 'Utilizador'}
          </span>
                </div>

                {message && <div className="message">{message}</div>}

                {!isEditing ? (
                    <div className="profile-info">
                        <div className="info-row">
                            <strong>Nome:</strong> <span>{formData.name || user.name}</span>
                        </div>
                        <div className="info-row">
                            <strong>Email:</strong> <span>{user.email}</span>
                        </div>
                        <div className="info-row">
                            <strong>Telefone:</strong> <span>{formData.phone || 'Não definido'}</span>
                        </div>
                        <div className="info-row">
                            <strong>Instituição:</strong> <span>{formData.institution || 'Não definida'}</span>
                        </div>
                        <button className="btn-edit" onClick={() => setIsEditing(true)}>
                            ✏️ Editar Perfil
                        </button>
                        <button className="btn-logout" onClick={logout}>
                            🚪 Sair
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nome</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Telefone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+351 912 345 678"
                            />
                        </div>
                        <div className="form-group">
                            <label>Instituição</label>
                            <input
                                type="text"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                placeholder="Ex: Universidade dos Açores"
                            />
                        </div>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'A guardar...' : '💾 Guardar Alterações'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                            Cancelar
                        </button>
                    </form>
                )}
            </div>

            <style jsx>{`
        .profile-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
        }
        .profile-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .profile-header {
          background: linear-gradient(135deg, #3498db, #2c3e50);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .profile-icon {
          font-size: 60px;
        }
        .profile-header h1 {
          margin: 10px 0;
        }
        .role-badge {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          background: rgba(255,255,255,0.2);
        }
        .role-badge.admin {
          background: #e67e22;
        }
        .profile-info, form {
          padding: 30px;
        }
        .info-row {
          padding: 12px 0;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
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
        .btn-edit, .btn-save, .btn-logout, .btn-cancel {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-edit {
          background: #3498db;
          color: white;
        }
        .btn-save {
          background: #27ae60;
          color: white;
        }
        .btn-logout {
          background: #e74c3c;
          color: white;
        }
        .btn-cancel {
          background: #95a5a6;
          color: white;
        }
        .message {
          margin: 20px;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          background: #d4edda;
          color: #155724;
        }
      `}</style>
        </motion.div>
    );
}