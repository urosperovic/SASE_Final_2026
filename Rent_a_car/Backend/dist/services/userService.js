"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../entities/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_trainer_1 = require("../entities/user_trainer");
dotenv_1.default.config();
const accessSecret = process.env.JWT_ACCESS_SECRET || '';
const accessTtl = process.env.JWT_ACCESS_TTL || '';
const refreshSecret = process.env.JWT_REFRESH_SECRET || '';
const refreshTtl = process.env.JWT_REFRESH_TTL || '';
const saltRounds = 10;
class UserService {
    static async getAllUsers() {
        const userRepository = (0, typeorm_1.getRepository)(user_1.User);
        const userTrainerRepository = (0, typeorm_1.getRepository)(user_trainer_1.User_Trainer);
        if (!userRepository)
            throw new Error('User repository not found');
        if (!userTrainerRepository)
            throw new Error('User_Trainer repository not found');
        const users = await userRepository.find();
        const usersWithTrainers = await Promise.all(users.map(async (user) => {
            const trainers = await userTrainerRepository.find({ where: { user: user } });
            return { user, trainers };
        }));
        return usersWithTrainers;
    }
    static async createUser(name, email, password) {
        const userRepository = (0, typeorm_1.getRepository)(user_1.User);
        if (!userRepository)
            throw new Error('User repository not found');
        // Check if the email already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email address already in use');
        }
        const user = new user_1.User();
        user.name = name;
        user.email = email;
        user.password = await bcryptjs_1.default.hash(password, saltRounds);
        return await userRepository.save(user);
    }
    static async login(email, password) {
        const userRepository = (0, typeorm_1.getRepository)(user_1.User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (await bcryptjs_1.default.compare(password, user.password)) {
            // Generating access token during login
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, accessSecret, { expiresIn: accessTtl });
            // Generating refresh token during login
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, refreshSecret, { expiresIn: refreshTtl });
            return { accessToken, refreshToken };
        }
        throw new Error('BAD CREDENTIALS');
    }
    static async getUserById(id) {
        const userRepository = (0, typeorm_1.getRepository)(user_1.User);
        const user = await userRepository.findOne({ where: { id: Number(id) } });
        return user || undefined;
    }
    static async getSelectedTrainersForUser(userId) {
        const userTrainerRepository = (0, typeorm_1.getRepository)(user_trainer_1.User_Trainer);
        if (!userTrainerRepository)
            throw new Error('User_Trainer repository not found');
        const selectedTrainers = await userTrainerRepository.find({ where: { user: { id: userId } } });
        return selectedTrainers;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map