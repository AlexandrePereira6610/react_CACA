import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, deleteUser, updateUser } from '../services/api';
import { motion } from 'framer-motion';

export default function AdminPanel() {
    const { user, isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isAdmin) {
            loadUsers();
        }
    }, [isAdmin]);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers(localStorage.getItem('token'));
            setUsers(data);
        } catch (err) {
            console.error(err);
            setMessage('❌ Erro ao carregar utilizadores');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Tem certeza que deseja remover este utilizador?')) {
            try {
                await deleteUser(localStorage.getItem('token'), userId);
                setMessage('✅ Utilizador removido com sucesso!');
                loadUsers();
                setTimeout(() => setMessage(''), 3000);
            } catch (err) {
                setMessage('❌ Erro ao remover utilizador');
            }
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await updateUser(localStorage.getItem('token'), editingUser._id, editForm);
            setMessage('✅ Utilizador atualizado com sucesso!');
            setEditingUser(null);
            loadUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('❌ Erro ao atualizar utilizador');
        }
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setEditForm({ name: '', email: '', role: 'user' });
    };

    if (!isAdmin) {
        return (
            <div className="admin-container">
                <div className="access-denied">
                    <h2>⛔ Acesso Negado</h2>
                    <p>Apenas administradores podem aceder a esta página.</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="admin-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="admin-card">
                <h1> Painel de Administração</h1>
                <p>Bem-vindo, <strong>{user?.name}</strong>!</p>

                {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

                <div className="users-list">
                    <h2>📋 Utilizadores Registados ({users.length})</h2>

                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <table className="users-table">
                            <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Perfil</th>
                                <th>Data de Registo</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td data-label="Nome">{u.name}</td>
                                    <td data-label="Email">{u.email}</td>
                                    <td data-label="Perfil">
                      <span className={`role ${u.role}`}>
                        {u.role === 'admin' ? ' Admin' : '👤 User'}
                      </span>
                                    </td>
                                    <td data-label="Data">{new Date(u.createdAt).toLocaleDateString('pt-PT')}</td>
                                    <td data-label="Ações" className="actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEditClick(u)}
                                            title="Editar utilizador"
                                        >
                                            ✏️
                                        </button>
                                        {u._id !== user._id && (
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDeleteUser(u._id)}
                                                title="Remover utilizador"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal de Edição */}
            {editingUser && (
                <div className="modal-overlay" onClick={cancelEdit}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>✏️ Editar Utilizador</h2>
                        <form onSubmit={handleUpdateUser}>
                            <div className="form-group">
                                <label>Nome</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Perfil</label>
                                <select name="role" value={editForm.role} onChange={handleEditChange}>
                                    <option value="user">👤 Utilizador Normal</option>
                                    <option value="admin"> Administrador</option>
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="btn-save">💾 Guardar</button>
                                <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
}