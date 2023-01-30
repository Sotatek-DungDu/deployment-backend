import { UserEntity } from 'src/model/entities/user.entity';
import { CommandEntity } from './command.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
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

  @Column({ nullable: false })
  src: string;

  @OneToOne(() => CommandEntity)
  @JoinColumn({ name: ' command' })
  command: CommandEntity;
}
