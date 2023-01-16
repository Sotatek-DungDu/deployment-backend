import { IsEmail } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
