import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../auth/user.repository';

import { AuthModule } from '../auth/auth.module';
import { EmployerController } from './employer.controller';
import { EmployerRepository } from './employer.repository';
import { CreateEmployerUseCase } from './useCases/createEmployer';
import { GetEmployerUseCase } from './useCases/getEmployer';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployerRepository, UserRepository]),
    AuthModule,
  ],
  providers: [CreateEmployerUseCase, GetEmployerUseCase],
  controllers: [EmployerController],
})
export class EmployerModule {}
