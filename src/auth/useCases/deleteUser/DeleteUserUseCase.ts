import { InjectRepository } from '@nestjs/typeorm';

import { AppError, Either, left, Result, right, UseCase } from 'shared/core';

import { UserRepository } from '../../user.repository';
import { DeleteUserErrors } from './DeleteUserErrors';
import { DeleteUserDTO } from './DeleteUserDTO';
import { User } from '../../domain';

type Response = Either<
  AppError.UnexpectedError | DeleteUserErrors.UserNotFoundError,
  Result<void>
>;

export class DeleteUserUseCase
  implements UseCase<DeleteUserDTO, Promise<Response>> {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async execute(request: DeleteUserDTO): Promise<any> {
    let user: User;

    try {
      try {
        user = await this.userRepository.getUserByUserId(request.userId);
      } catch (err) {
        return left(new DeleteUserErrors.UserNotFoundError());
      }

      user.delete();

      await this.userRepository.persist(user);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
