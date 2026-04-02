import { validationResult, body, param } from 'express-validator';
import multer from 'multer';
import userService from '../services/userService.js';
import { avatarUpload, generateSignedUrl, uploadToWasabi } from '../config/fileConfig.js';
import fileService from '../services/fileService.js';


// Create a user
const createUser = [
    // Validation rules
    body('name').isString().withMessage('Name is required and must be a string'),
    body('username').isString().notEmpty().withMessage('Username is required and must be a string'),
    body('password').isString().notEmpty().withMessage('Password is required and must be a string'),
    body('avatarKey').optional().isString().withMessage('Avatar key must be a string'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('isAdmin').optional().isBoolean().withMessage('isAdmin must be a boolean'),
    body('isTeacher').optional().isBoolean().withMessage('isTeacher must be a boolean'),
    body('isStudent').optional().isBoolean().withMessage('isStudent must be a boolean'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, username, password, avatarKey, bio, isAdmin, isTeacher, isStudent } = req.body;

        try {
            const user = await userService.createUser({
                name,
                username,
                password,
                avatarKey,
                bio,
                isAdmin,
                isTeacher,
                isStudent,
            });
            res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    },
];

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        const usersWithSignedUrls = await Promise.all(
            users.map(async (user) => {
                let signedAvatarUrl = null;
                if (user.avatarKey) {
                    signedAvatarUrl = await generateSignedUrl(user.avatarKey);
                }
                return { ...user, avatarUrl: signedAvatarUrl };
            })
        );

        res.status(200).json(usersWithSignedUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get all teachers
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await userService.getAllTeachers();

        const teachersWithSignedUrls = await Promise.all(
            teachers.map(async (teacher) => {
                let signedAvatarUrl = null;
                if (teacher.avatarKey) {
                    signedAvatarUrl = await generateSignedUrl(teacher.avatarKey);
                }
                return { ...teacher, avatarUrl: signedAvatarUrl };
            })
        );

        res.status(200).json(teachersWithSignedUrls);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
};

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await userService.getAllStudents();

        const studentsWithSignedUrls = await Promise.all(
            students.map(async (student) => {
                let signedAvatarUrl = null;
                if (student.avatarKey) {
                    signedAvatarUrl = await generateSignedUrl(student.avatarKey);
                }
                return { ...student, avatarUrl: signedAvatarUrl };
            })
        );

        res.status(200).json(studentsWithSignedUrls);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

// Get a user by ID
const getUserById = [
    // Validation rules
    param('id').isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const user = await userService.getUserById(parseInt(id));
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            let signedAvatarUrl = null;
            if (user.avatarKey) {
                signedAvatarUrl = await generateSignedUrl(user.avatarKey);
            }

            res.status(200).json({ ...user, avatarUrl: signedAvatarUrl });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    },
];

// Get user profile by ID
const getUserProfileById = [
    // Validation rules
    param('id').isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const userProfile = await userService.getUserProfileById(parseInt(id));
            if (!userProfile) {
                return res.status(404).json({ error: 'User profile not found' });
            }

            let signedAvatarUrl = null;
            if (userProfile.avatarKey) {
                signedAvatarUrl = await generateSignedUrl(userProfile.avatarKey);
            }

            res.status(200).json({ ...userProfile, avatarUrl: signedAvatarUrl });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ error: 'Failed to fetch user profile' });
        }
    },
];

// Update user for admin usage
const updateUser = [
    // Validation rules
    param('id').isInt().withMessage('User ID must be a valid integer'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('username').optional().isString().withMessage('Username must be a string'),
    body('password').optional().isString().withMessage('Password must be a string'),
    body('avatarUrl').optional().isString().withMessage('Avatar URL must be a string'),
    body('bio').optional().isString().withMessage('Bio must be a string'), // Changed from "bias" to "bio"
    body('addRole').optional().isIn(['admin', 'teacher', 'student']).withMessage('addRole must be one of: admin, teacher, student'),
    body('removeRole').optional().isIn(['admin', 'teacher', 'student']).withMessage('removeRole must be one of: admin, teacher, student'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, username, password, avatarUrl, bio, addRole, removeRole } = req.body;

        try {
            const updatedUser = await userService.updateUser(parseInt(id), {
                name,
                username,
                password,
                avatarUrl,
                bio, // Changed from "bias" to "bio"
                addRole,
                removeRole,
            });
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    },
];

// Delete a user
const deleteUser = [
    // Validation rules
    param('id').isInt().withMessage('User ID must be a valid integer'),

    // Controller logic
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await userService.deleteUser(parseInt(id));
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    },
];

// Update avatarUrl, bio, or name
const updateUserProfile = [
    avatarUpload.single('avatar'),
    param('id').isInt().withMessage('User ID must be a valid integer'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('bio').optional().isString().withMessage('Bio must be a string'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, bio } = req.body;

        try {
            let avatarKey;
            let signedAvatarUrl;

            if (req.file) {
                const fileKey = `${Date.now()}-${req.file.originalname}`;
                console.log('Generated fileKey:', fileKey);

                // Upload the file to Wasabi
                await uploadToWasabi({ file: req.file, fileKey });

                // Save the file metadata in the database
                const savedFile = await fileService.uploadUserAvatar(parseInt(id), {
                    key: fileKey,
                    filename: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                });

                console.log('Saved file metadata:', savedFile);
                avatarKey = fileKey;

                // Generate the signed URL for the avatar
                signedAvatarUrl = await generateSignedUrl(fileKey)
            }

            // Update the user's profile
            const updatedUser = await userService.updateUserProfile(parseInt(id), {
                name,
                bio,
                avatarKey,
            });

            res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    ...updatedUser,
                    avatarUrl: signedAvatarUrl, // Include the signed URL in the response
                },
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            res.status(500).json({ error: 'Failed to update user profile' });
        }
    },
];


export default {
    createUser,
    getAllUsers,
    getUserById,
    getUserProfileById,
    updateUser,
    deleteUser,
    updateUserProfile,
    getAllTeachers,
    getAllStudents,
};