import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user";
import { User_Trainer } from "./user_trainer";
import { TimeSlot } from "./time_slot";

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  speciality: string;

  @ManyToMany(() => User, (user) => user.trainer)
  user: User[];

  @OneToMany(() => User_Trainer, (user_trainer) => user_trainer.trainer)
  user_trainers: User_Trainer[];

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.trainer, { cascade: true })
  @JoinColumn()
  timeSlots: TimeSlot[];
}
