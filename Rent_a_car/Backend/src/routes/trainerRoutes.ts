import express, {Router, Request, Response} from 'express';
import { TrainerService } from '../services/trainerService';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await TrainerService.getAllTrainers();
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch trainers', error: error.message});
    }
});
router.post('/' , async (req: Request, res: Response) => {
    try {
        const {id} = req.body;
        const user = await TrainerService.getTrainerById(id);
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch user', error: error.message});
    }
});

//get timeslot by id passed in body
router.post('/timeslot', async (req: Request, res: Response) => {
    try {
        const {id} = req.body;
        const timeSlot = await TrainerService.getTimeSlotById(id);
        return res.status(200).json(timeSlot);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch timeslot', error: error.message});
    }
});


router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password, speciality, timeSlots } = req.body; // Added timeSlots
        const user = await TrainerService.createTrainer(name, email, password, speciality, timeSlots); // Pass timeSlots to createTrainer
        return res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
});


//as a user pick trainer
router.post('/pick', async (req: Request, res: Response) => {
    try {
        const {trainerId,timeSlotId, userId} = req.body;
        if(!trainerId || !timeSlotId || !userId) throw new Error('TrainerId and UserId and Timeslot are required');
        
        //fetch trainer and user
        const user = await UserService.getUserById(userId);
        if(!user) throw new Error('User not found');

        const assign = await TrainerService.pickTrainer(trainerId,timeSlotId, user);
        return res.status(201).json(assign);
    } catch (error) {
        res.status(500).json({message: 'Failed to assign user', error: error.message});
    }
});

router.post('/unpick', async (req: Request, res: Response) => {
    try {
        const { trainerId, userId } = req.body;
        if (!trainerId || !userId) throw new Error('TrainerId and UserId are required');
        
        // Fetch user
        const user = await UserService.getUserById(userId);
        if (!user) throw new Error('User not found');

        // Unselect trainer
        await TrainerService.unpickTrainer(trainerId, user);
        
        return res.status(200).json({ message: 'Trainer unselected successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to unselect trainer', error: error.message });
    }
});

export default router;