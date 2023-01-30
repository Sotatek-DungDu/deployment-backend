import { ProjectEntity } from './project.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'permissions',
})
export class PermissionsEntity {
  @PrimaryGeneratedColumn()
  permissions_id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: ' user' })
  user: UserEntity;

  @OneToOne(() => ProjectEntity)
  @JoinColumn({ name: ' project' })
  project: ProjectEntity;
}
