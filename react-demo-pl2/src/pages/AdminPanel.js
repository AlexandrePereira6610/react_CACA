import React, { useState, useEffect } from 'react';
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

            <style jsx>{`
                .admin-container {
                    max-width: 1200px;
                    margin: 40px auto;
                    padding: 20px;
                }
                .admin-card {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    padding: 30px;
                }
                .admin-card h1 {
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                .users-list h2 {
                    margin: 30px 0 20px;
                    color: #34495e;
                }
                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .users-table th, .users-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                .users-table th {
                    background: #f8f9fa;
                    font-weight: 600;
                }
                .role {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                }
                .role.admin {
                    background: #e67e22;
                    color: white;
                }
                .role.user {
                    background: #3498db;
                    color: white;
                }
                .actions {
                    display: flex;
                    gap: 8px;
                }
                .btn-edit, .btn-delete {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 5px;
                    border-radius: 8px;
                    transition: background 0.3s;
                }
                .btn-edit:hover {
                    background: #3498db20;
                }
                .btn-delete:hover {
                    background: #e74c3c20;
                }
                .access-denied {
                    text-align: center;
                    padding: 60px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }
                .access-denied h2 {
                    color: #e74c3c;
                    margin-bottom: 10px;
                }
                .message {
                    padding: 10px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .message.success {
                    background: #d4edda;
                    color: #155724;
                }
                .message.error {
                    background: #f8d7da;
                    color: #721c24;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 30px;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 450px;
                }
                .modal-content h2 {
                    margin-bottom: 20px;
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
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                }
                .modal-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                .btn-save, .btn-cancel {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                }
                .btn-save {
                    background: #27ae60;
                    color: white;
                }
                .btn-cancel {
                    background: #95a5a6;
                    color: white;
                }
                @media (max-width: 768px) {
                    .users-table thead {
                        display: none;
                    }
                    .users-table tr {
                        display: block;
                        margin-bottom: 20px;
                        border: 1px solid #eee;
                        border-radius: 12px;
                        padding: 10px;
                    }
                    .users-table td {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border: none;
                        padding: 8px;
                    }
                    .users-table td::before {
                        content: attr(data-label);
                        font-weight: bold;
                        margin-right: 10px;
                    }
                }
            `}</style>
        </motion.div>
    );
}