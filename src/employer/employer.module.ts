import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../auth/user.repository';

import { EmployerController } from './employer.controller';
import { CreateEmployerUseCase } from './useCases/createEmployer';
import { EmployerRepository } from './employer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerRepository, UserRepository])],
  providers: [CreateEmployerUseCase],
  controllers: [EmployerController],
})
export class EmployerModule {}
