import { Response } from 'express';
import { Body, Controller, Logger, Post, Res } from '@nestjs/common';

import { BaseController } from 'shared/core';
import {
  CreateUserDTO,
  CreateUserErrors,
  CreateUserUseCase,
} from './useCases/createUser';

@Controller('auth')
export class AuthController extends BaseController {
  private logger = new Logger('AuthController');

  constructor(private createUserUseCase: CreateUserUseCase) {
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
            return this.fail(res, error.errorValue());
        }
      }

      this.logger.verbose(`User successfully created`);
      return this.ok(res);
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
