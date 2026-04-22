import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "./user";
import { Trainer } from "./trainer";
import { TimeSlot } from "./time_slot";

@Entity()
export class User_Trainer {
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    trainer_id: number;

    @PrimaryColumn()
    timeSlot_id: number;

    @ManyToOne(() => User, user => user.user_trainers)
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Trainer, trainer => trainer.user_trainers)
    @JoinColumn({ name: "trainer_id" })
    trainer: Trainer;

    @ManyToOne(() => TimeSlot)
    @JoinColumn({ name: "timeSlot_id" }) 
    timeSlot: TimeSlot;
}
