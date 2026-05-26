const User = require('../models/User');

// @desc    Obter todos os utilizadores (apenas admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Obter utilizador por ID (apenas admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Utilizador não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Atualizar utilizador (apenas admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(404).json({ message: 'Utilizador não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Eliminar utilizador (apenas admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'Utilizador removido com sucesso' });
        } else {
            res.status(404).json({ message: 'Utilizador não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };