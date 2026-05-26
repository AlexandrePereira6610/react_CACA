const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper para tratar respostas
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Algo correu mal');
    }
    return data;
};

// Auth endpoints
export const register = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return handleResponse(response);
};

export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    return handleResponse(response);
};

export const getProfile = async (token) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const updateProfile = async (token, userData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    return handleResponse(response);
};

// Admin endpoints
export const getAllUsers = async (token) => {
    const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const deleteUser = async (token, userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const updateUser = async (token, userId, userData) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    return handleResponse(response);
};