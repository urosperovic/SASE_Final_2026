"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerService = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const trainer_1 = require("../entities/trainer");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../entities/user");
const user_trainer_1 = require("../entities/user_trainer");
const time_slot_1 = require("../entities/time_slot");
dotenv_1.default.config();
const accessSecret = process.env.JWT_ACCESS_SECRET || '';
const accessTtl = process.env.JWT_ACCESS_TTL || '';
const refreshSecret = process.env.JWT_REFRESH_SECRET || '';
const refreshTtl = process.env.JWT_REFRESH_TTL || '';
const saltRounds = 10;
class TrainerService {
    static async getAllTrainers() {
        try {
            const trainerRepository = (0, typeorm_1.getRepository)(trainer_1.Trainer);
            if (!trainerRepository) {
                throw new Error("Trainer repository not found");
            }
            const trainers = await trainerRepository.find({ relations: ["timeSlots"] });
            return trainers;
        }
        catch (error) {
            throw new Error(`Error in getAllTrainers: ${error.message}`);
        }
    }
    static async createTrainer(name, email, password, speciality, timeSlots) {
        try {
            const trainerRepository = (0, typeorm_1.getRepository)(trainer_1.Trainer);
            if (!trainerRepository) {
                throw new Error("Trainer repository not found");
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
            const trainer = new trainer_1.Trainer();
            trainer.name = name;
            trainer.email = email;
            trainer.password = hashedPassword;
            trainer.speciality = speciality;
            // Create and associate time slots
            trainer.timeSlots = timeSlots.map(slot => {
                const timeSlot = new time_slot_1.TimeSlot();
                timeSlot.slot = slot;
                return timeSlot;
            });
            // Save the trainer entity with associated time slots
            return await trainerRepository.save(trainer);
        }
        catch (error) {
            throw new Error(`Error in createTrainer: ${error.message}`);
        }
    }
    static async pickTrainer(trainerId, timeSlotId, user) {
        const userRepository = (0, typeorm_1.getRepository)(user_1.User);
        const trainerRepository = (0, typeorm_1.getRepository)(trainer_1.Trainer);
        const userTrainerRepository = (0, typeorm_1.getRepository)(user_trainer_1.User_Trainer);
        const timeSlotRepository = (0, typeorm_1.getRepository)(time_slot_1.TimeSlot);
        // Find the trainer by id
        const trainer = await trainerRepository.findOne({ where: { id: trainerId } });
        const timeSlot = await timeSlotRepository.findOne({ where: { id: timeSlotId } });
        // Create a new instance of User_Trainer
        const user_trainer = new user_trainer_1.User_Trainer();
        user_trainer.user = user;
        user_trainer.trainer = trainer;
        user_trainer.timeSlot = timeSlot;
        await userTrainerRepository.save(user_trainer);
    }
    static async unpickTrainer(trainerId, user) {
        const userTrainerRepository = (0, typeorm_1.getRepository)(user_trainer_1.User_Trainer);
        // Find the user-trainer relationship
        const userTrainer = await userTrainerRepository.findOne({ where: { user, trainer: { id: trainerId } } });
        if (!userTrainer) {
            throw new Error('User-trainer relationship not found');
        }
        // Remove the user-trainer relationship
        await userTrainerRepository.remove(userTrainer);
    }
    static async getTrainerById(id) {
        const trainerRepository = (0, typeorm_1.getRepository)(trainer_1.Trainer);
        if (!trainerRepository)
            throw new Error('Trainer repository not found');
        const trainer = await trainerRepository.findOne({ where: { id }, relations: ['timeSlots'] });
        if (!trainer)
            throw new Error('Trainer not found');
        return trainer;
    }
    static async getTimeSlotById(id) {
        console.log('id', id);
        const timeSlotRepository = (0, typeorm_1.getRepository)(time_slot_1.TimeSlot);
        if (!timeSlotRepository)
            throw new Error('TimeSlot repository not found');
        const timeSlot = await timeSlotRepository.findOne({ where: { id } });
        if (!timeSlot)
            throw new Error('TimeSlot not found');
        return timeSlot;
    }
}
exports.TrainerService = TrainerService;
//# sourceMappingURL=trainerService.js.map