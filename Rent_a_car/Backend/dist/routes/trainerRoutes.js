"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trainerService_1 = require("../services/trainerService");
const userService_1 = require("../services/userService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const users = await trainerService_1.TrainerService.getAllTrainers();
        return res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch trainers', error: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const { id } = req.body;
        const user = await trainerService_1.TrainerService.getTrainerById(id);
        return res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
});
//get timeslot by id passed in body
router.post('/timeslot', async (req, res) => {
    try {
        const { id } = req.body;
        const timeSlot = await trainerService_1.TrainerService.getTimeSlotById(id);
        return res.status(200).json(timeSlot);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch timeslot', error: error.message });
    }
});
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, speciality, timeSlots } = req.body; // Added timeSlots
        const user = await trainerService_1.TrainerService.createTrainer(name, email, password, speciality, timeSlots); // Pass timeSlots to createTrainer
        return res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
});
//as a user pick trainer
router.post('/pick', async (req, res) => {
    try {
        const { trainerId, timeSlotId, userId } = req.body;
        if (!trainerId || !timeSlotId || !userId)
            throw new Error('TrainerId and UserId and Timeslot are required');
        //fetch trainer and user
        const user = await userService_1.UserService.getUserById(userId);
        if (!user)
            throw new Error('User not found');
        const assign = await trainerService_1.TrainerService.pickTrainer(trainerId, timeSlotId, user);
        return res.status(201).json(assign);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to assign user', error: error.message });
    }
});
router.post('/unpick', async (req, res) => {
    try {
        const { trainerId, userId } = req.body;
        if (!trainerId || !userId)
            throw new Error('TrainerId and UserId are required');
        // Fetch user
        const user = await userService_1.UserService.getUserById(userId);
        if (!user)
            throw new Error('User not found');
        // Unselect trainer
        await trainerService_1.TrainerService.unpickTrainer(trainerId, user);
        return res.status(200).json({ message: 'Trainer unselected successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to unselect trainer', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=trainerRoutes.js.map