import roleService from '../services/roleService.js';

const getRoles = (req, res) => {
    try {
        const roles = roleService.getRoles();
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
};

export default {
    getRoles,
};