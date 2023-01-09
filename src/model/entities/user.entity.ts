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

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  instagramUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  facebookUrl: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
