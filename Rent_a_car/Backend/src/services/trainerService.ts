import { Repository, getRepository } from "typeorm";
import dotenv from "dotenv";
import { Trainer } from "../entities/trainer";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Express } from "express";
import bcrypt from "bcryptjs";
import { User } from "../entities/user";
import { User_Trainer } from "../entities/user_trainer";
import { TimeSlot } from "../entities/time_slot";

dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET || '';
const accessTtl = process.env.JWT_ACCESS_TTL || '';
const refreshSecret = process.env.JWT_REFRESH_SECRET || '';
const refreshTtl = process.env.JWT_REFRESH_TTL || '';
const saltRounds = 10;


export class TrainerService {
    static async getAllTrainers(): Promise<Trainer[]> {
        try {
            const trainerRepository: Repository<Trainer> = getRepository(Trainer);

            if (!trainerRepository) {
                throw new Error("Trainer repository not found");
            }

            const trainers = await trainerRepository.find({ relations: ["timeSlots"] });
            
            return trainers;
        } catch (error) {
            throw new Error(`Error in getAllTrainers: ${error.message}`);
        }
    }

    static async createTrainer(
        name: string,
        email: string,
        password: string,
        speciality: string,
        timeSlots: string[]
      ): Promise<Trainer> {
        try {
          const trainerRepository: Repository<Trainer> = getRepository(Trainer);
          if (!trainerRepository) {
            throw new Error("Trainer repository not found");
          }
      
          const hashedPassword = await bcrypt.hash(password, saltRounds);
      
          const trainer = new Trainer();
          trainer.name = name;
          trainer.email = email;
          trainer.password = hashedPassword;
          trainer.speciality = speciality;
      
          // Create and associate time slots
          trainer.timeSlots = timeSlots.map(slot => {
            const timeSlot = new TimeSlot();
            timeSlot.slot = slot;
            return timeSlot;
          });
      
          // Save the trainer entity with associated time slots
          return await trainerRepository.save(trainer);
        } catch (error) {
          throw new Error(`Error in createTrainer: ${error.message}`);
        }
      }
      

      static async pickTrainer(trainerId: number, timeSlotId: number, user: User): Promise<void> {
        const userRepository = getRepository(User);
        const trainerRepository = getRepository(Trainer);
        const userTrainerRepository = getRepository(User_Trainer);
        const timeSlotRepository = getRepository(TimeSlot);
        // Find the trainer by id
        const trainer = await trainerRepository.findOne({ where: { id: trainerId } });
        const timeSlot = await timeSlotRepository.findOne({ where: { id: timeSlotId } });
        // Create a new instance of User_Trainer
        const user_trainer = new User_Trainer();
        
        user_trainer.user = user;
        user_trainer.trainer = trainer;
        user_trainer.timeSlot = timeSlot; 
    
        await userTrainerRepository.save(user_trainer);
        
    }
    
    static async unpickTrainer(trainerId: number, user: User): Promise<void> {
      const userTrainerRepository = getRepository(User_Trainer);

      // Find the user-trainer relationship
      const userTrainer = await userTrainerRepository.findOne({ where: { user, trainer: { id: trainerId } } });

      if (!userTrainer) {
          throw new Error('User-trainer relationship not found');
      }

      // Remove the user-trainer relationship
      await userTrainerRepository.remove(userTrainer);
  }

    static async getTrainerById(id: number): Promise<Trainer> {
        const trainerRepository: Repository<Trainer> = getRepository(Trainer);
        if (!trainerRepository) throw new Error('Trainer repository not found');
        const trainer = await trainerRepository.findOne({ where: { id }, relations: ['timeSlots']});
        if (!trainer) throw new Error('Trainer not found');
        return trainer;
    }

    static async getTimeSlotById(id: number): Promise<TimeSlot> {
        console.log('id', id);
        const timeSlotRepository: Repository<TimeSlot> = getRepository(TimeSlot);
        if (!timeSlotRepository) throw new Error('TimeSlot repository not found');
        const timeSlot = await timeSlotRepository.findOne({ where: { id }});
        if (!timeSlot) throw new Error('TimeSlot not found');
        return timeSlot;
    }

    
}