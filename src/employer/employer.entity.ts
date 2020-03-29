import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

import { AbstractEntity } from 'shared/core';

import { UserEntity } from '../auth/user.entity';

@Entity('employer')
export class EmployerEntity extends AbstractEntity {
  @PrimaryColumn()
  employerId: string;

  @Column({ default: '' })
  companyName: string;

  @Column({ default: '' })
  companyDescription: string;

  @OneToOne(
    () => UserEntity,
    (user: UserEntity) => user.employer,
  )
  user: UserEntity;

  @Column()
  userId: string;
}
