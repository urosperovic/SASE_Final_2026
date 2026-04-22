import { SessionManager } from "@/utils/session.manager";
import axios, {AxiosError, type AxiosResponse} from "axios";

const client = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    validateStatus: function (code) {
        return code === 200 || code === 201;
    }
});

export class TrainerService {
    //get all trainers
    static async getAllTrainers() {
        return client.get('/trainer');
    }
    static async getSelectedTrainers(userId: number) {
        try {
            const response = await client.get(`/users/${userId}/trainers`);

            return response;
        } catch (error) {
            throw new Error('Failed to fetch selected trainers: ' + (error as AxiosError).message);
        }
    }

    static async pickTrainer(trainerId: number, userId: number, timeSlotId: number) {
        try {
            const response = await client.post('/trainer/pick', { trainerId, userId,timeSlotId });
            return response.data;
        } catch (error) {
            throw new Error('Failed to pick trainer: ' + (error as AxiosError).message);
        }
    }

    static async unpickTrainer(trainerId: number, userId: number) {
        try {
            const response = await client.post('/trainer/unpick', { trainerId, userId });
            return response.data;
        } catch (error) {
            throw new Error('Failed to unpick trainer: ' + (error as AxiosError).message);
        }
    }
    
    static async getTimeSlots(id: number) {
        return client.post('/trainer/timeslot', {id});
    }

    static async getTrainerById(id: number) {
        return client.post('/trainer', {id});
    }
    
    
}


