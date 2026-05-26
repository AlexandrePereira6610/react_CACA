const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Registar novo utilizador
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Utilizador já existe com este email' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Dados de utilizador inválidos' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Login de utilizador
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.comparePassword(password))) {
            user.lastLogin = Date.now();
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Email ou password inválidos' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Obter perfil do utilizador atual
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            phone: user.phone,
            institution: user.institution,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Atualizar perfil do utilizador
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.institution = req.body.institution || user.institution;
            user.profilePicture = req.body.profilePicture || user.profilePicture;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePicture: updatedUser.profilePicture,
                phone: updatedUser.phone,
                institution: updatedUser.institution
            });
        } else {
            res.status(404).json({ message: 'Utilizador não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };