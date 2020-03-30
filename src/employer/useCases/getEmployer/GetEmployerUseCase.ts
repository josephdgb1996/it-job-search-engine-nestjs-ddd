import { InjectRepository } from '@nestjs/typeorm';

import { AppError, Either, left, Result, right, UseCase } from 'shared/core';

import { UserRepository } from '../../../auth/user.repository';
import { UserEntity } from '../../../auth/user.entity';
import { User } from '../../../auth/domain';

import { EmployerRepository } from '../../employer.repository';
import { GetEmployerErrors } from './GetEmployerErrors';
import { EmployerDTO } from '../../dtos';
import { Employer } from '../../domain';

type Response = Either<
  | GetEmployerErrors.EmployerNotFoundError
  | GetEmployerErrors.UserNotFoundError
  | AppError.UnexpectedError,
  Result<EmployerDTO>
>;

export class GetEmployerUseCase
  implements UseCase<UserEntity, Promise<Response>> {
  constructor(
    @InjectRepository(EmployerRepository)
    private employerRepository: EmployerRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(request: UserEntity): Promise<Response> {
    let employer: Employer;
    let user: User;

    try {
      try {
        user = await this.userRepository.getUserByUserId(request.userId);
      } catch (err) {
        return left(new GetEmployerErrors.UserNotFoundError(request.userId));
      }

      try {
        employer = await this.employerRepository.getEmployerByUserId(
          request.userId,
        );
      } catch (err) {
        return left(
          new GetEmployerErrors.EmployerNotFoundError(request.userId),
        );
      }

      const dto: EmployerDTO = {
        companyName: employer.companyName.value,
        companyDescription: employer.companyDescription.value,
        user: {
          userId: user.userId.id.toString(),
          email: user.email.value,
          username: user.username.value,
        },
      };

      return right(Result.ok<EmployerDTO>(dto));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
