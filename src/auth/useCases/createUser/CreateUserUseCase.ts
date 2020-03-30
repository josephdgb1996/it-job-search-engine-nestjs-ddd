import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Either, left, Result, right } from 'shared/core/Result';
import { AppError, UseCase } from 'shared/core';

import { User, UserEmail, UserName, UserPassword } from '../../domain';
import { UserRepository } from '../../user.repository';
import { CreateUserErrors } from './CreateUserErrors';
import { CreateUserDTO } from './CreateUserDTO';

type Response = Either<
  | CreateUserErrors.EmailAlreadyExistsError
  | CreateUserErrors.UsernameTakenError
  | AppError.UnexpectedError,
  Result<void>
>;

@Injectable()
export class CreateUserUseCase
  implements UseCase<CreateUserDTO, Promise<Response>> {
  constructor(
    @InjectRepository(UserRepository) // imports in auth.module.ts
    private userRepository: UserRepository,
  ) {}

  async execute(request: CreateUserDTO): Promise<Response> {
    const emailOrError = UserEmail.create({ value: request.email });
    const passwordOrError = UserPassword.create({ value: request.password });
    const usernameOrError = UserName.create({ value: request.username });

    const dtoResult = Result.combine([
      emailOrError,
      passwordOrError,
      usernameOrError,
    ]);

    if (!dtoResult.isSuccess) {
      return left(Result.fail(dtoResult.error as string));
    }

    const email = emailOrError.getValue();
    const password = passwordOrError.getValue();
    const username = usernameOrError.getValue();

    try {
      const userAlreadyExists = await this.userRepository.exists(email.value);

      if (userAlreadyExists) {
        return left(new CreateUserErrors.EmailAlreadyExistsError(email.value));
      }

      try {
        const usernameTaken = await this.userRepository.getUserByUsername(
          username.value,
        );

        if (usernameTaken) {
          return left(
            new CreateUserErrors.UsernameTakenError(username.value),
          ) as Response;
        }
      } catch (err) {}

      const userOrError = User.create({
        email,
        password,
        username,
        isAdminUser: false,
        isDeleted: false,
      });

      if (!userOrError.isSuccess) {
        return left(Result.fail(userOrError.error!.toString()));
      }

      const user: User = userOrError.getValue();

      await this.userRepository.persist(user);

      return right(Result.ok());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
