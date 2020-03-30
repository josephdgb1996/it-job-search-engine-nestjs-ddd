import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AppError, UseCase, Result, Either, left, right } from 'shared/core';
import { UniqueEntityID } from 'shared/domain';

import { UserRepository } from '../../../auth/user.repository';
import { User, UserId } from '../../../auth/domain';

import { CreateEmployerErrors } from './CreateEmployerErrors';
import { CreateEmployerDTO } from './CreateEmployerDTO';
import { EmployerRepository } from '../../employer.repository';
import { Employer, CompanyName, CompanyDescription } from '../../domain';

type Response = Either<
  | CreateEmployerErrors.EmployerAlreadyExistsError
  | CreateEmployerErrors.UserDoesntExistError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

@Injectable()
export class CreateEmployerUseCase
  implements UseCase<CreateEmployerDTO, Promise<Response>> {
  constructor(
    @InjectRepository(EmployerRepository)
    private employerRepository: EmployerRepository,
    private userRepository: UserRepository,
  ) {}

  public async execute(request: CreateEmployerDTO, id: string): Promise<Response> {
    // todo: user should comes from auth middleware
    let user: User;
    let employer: Employer;

    const userIdOrError = UserId.create(new UniqueEntityID(id));
    const companyNameOrError = CompanyName.create({
      value: request.companyName,
    });
    const companyDescriptionOrError = CompanyDescription.create({
      value: request.companyDescription,
    });

    const dtoResult = Result.combine([
      userIdOrError,
      companyNameOrError,
      companyDescriptionOrError,
    ]);

    if (!dtoResult.isSuccess) {
      return left(Result.fail(dtoResult.error as string));
    }

    const userId = userIdOrError.getValue();
    const companyName = companyNameOrError.getValue();
    const companyDescription = companyDescriptionOrError.getValue();

    try {
      try {
        user = await this.userRepository.getUserByUserId(userId.id.toString());
      } catch (err) {
        return left(
          new CreateEmployerErrors.UserDoesntExistError(userId.id.toString()),
        );
      }

      try {
        employer = await this.employerRepository.getEmployerByUserId(
          userId.id.toString(),
        );

        if (!!employer) {
          return left(
            new CreateEmployerErrors.EmployerAlreadyExistsError(
              userId.id.toString(),
            ),
          );
        }
      } catch (err) {}

      const employerOrError = Employer.create({
        userId: user.userId,
        companyName,
        companyDescription,
      });

      if (!employerOrError.isSuccess) {
        return left(employerOrError);
      }

      employer = employerOrError.getValue();

      await this.employerRepository.persist(employer);

      return right(Result.ok());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
