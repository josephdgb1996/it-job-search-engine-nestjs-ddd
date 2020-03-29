import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

import { AbstractEntity } from 'shared/core';

import { EmployerEntity } from '../employer/employer.entity';

@Entity('user')
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

  @OneToOne(
    () => EmployerEntity,
    (employer: EmployerEntity) => employer.user,
  )
  @JoinColumn()
  employer: EmployerEntity;
}
