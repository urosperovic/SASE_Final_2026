import { Repository, getRepository } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/user";
import jwt from "jsonwebtoken";
import { Request, Express } from "express";
import bcrypt from "bcryptjs";
import { User_Trainer } from "../entities/user_trainer";
import { Trainer } from "../entities/trainer";

dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET || '';
const accessTtl = process.env.JWT_ACCESS_TTL || '';
const refreshSecret = process.env.JWT_REFRESH_SECRET || '';
const refreshTtl = process.env.JWT_REFRESH_TTL || '';
const saltRounds = 10;

export class UserService {
    static async getAllUsers(): Promise<{ user: User; trainers: User_Trainer[] }[]> {
        const userRepository: Repository<User> = getRepository(User);
        const userTrainerRepository: Repository<User_Trainer> = getRepository(User_Trainer);

        if (!userRepository) throw new Error('User repository not found');
        if (!userTrainerRepository) throw new Error('User_Trainer repository not found');

        const users = await userRepository.find();

        const usersWithTrainers = await Promise.all(users.map(async user => {
            const trainers = await userTrainerRepository.find({ where: { user: user } });

            return { user, trainers };
        }));

        return usersWithTrainers;
    }

    static async createUser(name: string, email: string, password: string): Promise<User> {
        const userRepository: Repository<User> = getRepository(User);
        if (!userRepository) throw new Error('User repository not found');
    
        // Check if the email already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email address already in use');
        }
    
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = await bcrypt.hash(password, saltRounds);
        return await userRepository.save(user);
    }

    static async login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (await bcrypt.compare(password, user.password)) {
            // Generating access token during login
            const accessToken = jwt.sign({ userId: user.id }, accessSecret, { expiresIn: accessTtl });

            // Generating refresh token during login
            const refreshToken = jwt.sign({ userId: user.id }, refreshSecret, { expiresIn: refreshTtl });

            return { accessToken, refreshToken };
        }
        throw new Error('BAD CREDENTIALS');
    }

    static async getUserById(id: string): Promise<User | undefined> {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id: Number(id) } });

        return user || undefined;
    }

    static async getSelectedTrainersForUser(userId: number): Promise<User_Trainer[]> {
        const userTrainerRepository: Repository<User_Trainer> = getRepository(User_Trainer);
        if (!userTrainerRepository) throw new Error('User_Trainer repository not found');

        const selectedTrainers = await userTrainerRepository.find({ where: { user: { id: userId } }});

        return selectedTrainers;
    }

}
