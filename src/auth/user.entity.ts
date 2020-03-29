import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

import { AbstractEntity } from '../shared/core';

@Entity("user")
@Unique(['email', 'username'])
export class UserEntity extends AbstractEntity {
  @PrimaryColumn()
  userId: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdminUser: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  // @OneToOne(
  //   () => Employer,
  //   (employer: Employer) => employer.user
  // )
  // @JoinColumn()
  // employer!: Employer;
}
