import { ProjectEntity } from './project.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'permissions',
})
export class PermissionsEntity {
  @PrimaryGeneratedColumn()
  permission_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: ' user' })
  user: UserEntity;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: ' project' })
  project: ProjectEntity;
}
