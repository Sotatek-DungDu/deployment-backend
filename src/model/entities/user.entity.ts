import { IsEmail } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  DEV = 'dev',
  ADMIN = 'admin',
}
@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profileImg: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @Column({ type: 'enum', enum: UserRole, default: UserRole.DEV })
  role: UserRole;
}
