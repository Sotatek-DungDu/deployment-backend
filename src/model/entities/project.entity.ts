import { CommandEntity } from './command.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'project',
})
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  project_id: number;

  @Column({ nullable: false })
  name: string;

  @OneToOne(() => CommandEntity)
  @JoinColumn({ name: ' command' })
  command: CommandEntity;
}
