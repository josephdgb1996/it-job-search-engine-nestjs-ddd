import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../auth/user.repository';

import { EmployerController } from './employer.controller';
import { CreateEmployerUseCase } from './useCases/createEmployer';
import { EmployerRepository } from './employer.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployerRepository, UserRepository]),
    AuthModule,
  ],
  providers: [CreateEmployerUseCase],
  controllers: [EmployerController],
})
export class EmployerModule {}
