import {Router, Request, Response} from 'express';
import { UserService } from '../services/userService';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await UserService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch users', error: error.message});
    }
}); // get all users

router.post('/' , async (req: Request, res: Response) => {
    try {
        const {id} = req.body;
        const user = await UserService.getUserById(id);
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch user', error: error.message});
    }
}); // get user by id

//allows user to signup using basic information
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;
        const user = await UserService.createUser(name,email, password);
        return res.status(201).json(user);
    } catch (error) {
        res.status(500).json({message: 'Failed to create user', error: error.message});
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await UserService.login(email, password);
        return res.status(200).json({ accessToken , refreshToken});
    } catch (error) {
        return res.status(401).json({ message: 'Invalid credentials', error: error.message });
    }
}); // query for login

router.get('/:userId/trainers', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const selectedTrainers = await UserService.getSelectedTrainersForUser(userId);
        return res.status(200).json(selectedTrainers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch selected trainers', error: error.message });
    }
}); // get selected trainers for user

router.get('/user/:access', async (req: Request, res: Response) => {
    try {
        // Extract the token from the query parameters
        const access = req.params.access as string;
        
        const decodedToken = jwt.verify(access, process.env.JWT_ACCESS_SECRET) as { userId: string }
        const userId = decodedToken.userId; 
        const user = await UserService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user in the response
        return res.status(200).json(user);
    } catch (error) {
        // Handle errors, such as invalid token or database errors
        return res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
}); // get user by access token // funkcija da ostanem prijavljena

router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const refreshToken = req.headers.authorization?.split(' ')[1];
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not provided' });
        }

        const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as { userId?: string };


        const userId = decodedToken.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found in token' });
        }

        const user = await UserService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TTL });
        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return res.status(500).json({ message: 'Failed to refresh access token', error: error.message });
    }
}); // refresh access token





export default router;