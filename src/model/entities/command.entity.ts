import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'command',
})
export class CommandEntity {
  @PrimaryGeneratedColumn()
  command_id: number;

  @Column({ nullable: true })
  git_status: string;

  @Column({ nullable: true })
  git_pull: string;

  @Column({ nullable: true })
  install: string;

  @Column({ nullable: true })
  run: string;
}
