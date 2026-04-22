"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userService_1 = require("../services/userService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const users = await userService_1.UserService.getAllUsers();
        return res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
}); // get all users
router.post('/', async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userService_1.UserService.getUserById(id);
        return res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
}); // get user by id
//allows user to signup using basic information
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userService_1.UserService.createUser(name, email, password);
        return res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await userService_1.UserService.login(email, password);
        return res.status(200).json({ accessToken, refreshToken });
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid credentials', error: error.message });
    }
}); // query for login
router.get('/:userId/trainers', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const selectedTrainers = await userService_1.UserService.getSelectedTrainersForUser(userId);
        return res.status(200).json(selectedTrainers);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch selected trainers', error: error.message });
    }
}); // get selected trainers for user
router.get('/user/:access', async (req, res) => {
    try {
        // Extract the token from the query parameters
        const access = req.params.access;
        const decodedToken = jsonwebtoken_1.default.verify(access, process.env.JWT_ACCESS_SECRET);
        const userId = decodedToken.userId;
        const user = await userService_1.UserService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return the user in the response
        return res.status(200).json(user);
    }
    catch (error) {
        // Handle errors, such as invalid token or database errors
        return res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
}); // get user by access token // funkcija da ostanem prijavljena
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.headers.authorization?.split(' ')[1];
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not provided' });
        }
        const decodedToken = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const userId = decodedToken.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found in token' });
        }
        const user = await userService_1.UserService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TTL });
        return res.status(200).json({ accessToken });
    }
    catch (error) {
        console.error('Error refreshing access token:', error);
        return res.status(500).json({ message: 'Failed to refresh access token', error: error.message });
    }
}); // refresh access token
exports.default = router;
//# sourceMappingURL=userRoutes.js.map