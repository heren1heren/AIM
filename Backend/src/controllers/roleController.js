import roleService from '../services/roleService.js';

const getRoles = async (req, res) => {
    try {
        const roles = await roleService.getRoles(); // Fetch roles from the service
        res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch roles' });
    }
};

export default {
    getRoles,
};