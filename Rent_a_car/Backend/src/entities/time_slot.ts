import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Trainer } from "./trainer";

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slot: string;

  @ManyToOne(() => Trainer, (trainer) => trainer.timeSlots)
  trainer: Trainer;
}
