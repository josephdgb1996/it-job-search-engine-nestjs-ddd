import { Response } from 'express';
import { Body, Controller, Logger, Post, Res } from '@nestjs/common';

import { BaseController } from 'shared/core';
import {
  CreateUserDTO,
  CreateUserErrors,
  CreateUserUseCase,
} from './useCases/createUser';
import {
  LoginUserDTO,
  LoginUserErrors,
  LoginUserUseCase,
} from './useCases/loginUser';
import {
  DeleteUserDTO,
  DeleteUserErrors,
  DeleteUserUseCase,
} from './useCases/deleteUser';

@Controller('auth')
export class AuthController extends BaseController {
  private logger = new Logger('AuthController');

  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {
    super();
  }

  @Post('/signup')
  async signUp(
    @Body() createUserDto: CreateUserDTO,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.createUserUseCase.execute(createUserDto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.UsernameTakenError:
          case CreateUserErrors.EmailAlreadyExistsError:
            this.logger.error(error.errorValue().message);
            return this.conflict(res, error.errorValue().message);

          default:
            this.logger.error(error.errorValue());
            return this.fail(res, error.errorValue() as any);
        }
      }

      this.logger.verbose('User successfully created');
      return this.ok(res);
    } catch (err) {
      return this.fail(res, err);
    }
  }

  @Post('signin')
  async signIn(
    @Body() loginUserDTO: LoginUserDTO,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.loginUserUseCase.execute(loginUserDTO);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case LoginUserErrors.UserNameDoesntExistError:
            this.logger.error(error.errorValue().message);
            return this.notFound(res, error.errorValue().message);

          case LoginUserErrors.PasswordDoesntMatchError:
            this.logger.error(error.errorValue().message);
            return this.clientError(res, error.errorValue().message);

          default:
            this.logger.error(error.errorValue());
            return this.fail(res, error.errorValue() as any);
        }
      }

      this.logger.verbose('User successfully login');
      const dto = result.value.getValue();
      return this.ok(res, dto);
    } catch (err) {
      return this.fail(res, err);
    }
  }

  @Post('delete')
  async deleteUser(
    @Body() deleteUserDto: DeleteUserDTO,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.deleteUserUseCase.execute(deleteUserDto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteUserErrors.UserNotFoundError:
            this.logger.error(error.errorValue().message);
            return this.notFound(res, error.errorValue().message);

          default:
            this.logger.error(error.errorValue());
            return this.fail(res, error.errorValue() as any);
        }
      }

      this.logger.verbose('User successfully deleted');
      return this.ok(res);
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
