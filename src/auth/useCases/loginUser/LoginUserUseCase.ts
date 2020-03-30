import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { AppError, Either, left, Result, right, UseCase } from 'shared/core';

import { JwtPayload } from '../../domain/types';
import { User, UserName, UserPassword } from '../../domain';
import { LoginUserErrors } from './LoginUserErrors';
import { UserRepository } from '../../user.repository';
import { LoginUserDTO, LoginUserDTOResponse } from './LoginUserDTO';

type Response = Either<
  | LoginUserErrors.PasswordDoesntMatchError
  | LoginUserErrors.UserNameDoesntExistError
  | AppError.UnexpectedError,
  Result<LoginUserDTOResponse>
>;

export class LoginUserUseCase
  implements UseCase<LoginUserDTO, Promise<Response>> {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(request: LoginUserDTO): Promise<Response> {
    let user: User;
    let username: UserName;
    let password: UserPassword;

    try {
      const usernameOrError = UserName.create({ value: request.username });
      const passwordOrError = UserPassword.create({ value: request.password });

      const payloadResult = Result.combine([usernameOrError, passwordOrError]);

      if (!payloadResult.isSuccess) {
        // todo: modify Result class, remove generic, always return string
        return left(Result.fail(payloadResult.error as string));
      }

      username = usernameOrError.getValue();
      password = passwordOrError.getValue();

      try {
        user = await this.userRepository.getUserByUsername(username.value);
      } catch (err) {
        return left(new LoginUserErrors.UserNameDoesntExistError());
      }

      const isPasswordValid = await user.password.comparePassword(
        password.value,
      );

      if (!isPasswordValid) {
        return left(new LoginUserErrors.PasswordDoesntMatchError());
      }

      const payload: JwtPayload = {
        username: user.username.value,
        userId: user.userId.id.toString(),
      };

      const token = await this.jwtService.sign(payload);

      return right(
        Result.ok({
          token,
        }),
      );
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()));
    }
  }
}
