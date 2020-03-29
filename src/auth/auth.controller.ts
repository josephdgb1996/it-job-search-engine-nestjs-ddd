import { Response } from 'express';
import { Body, Controller, Post, Res } from '@nestjs/common';

import { BaseController } from 'shared/core';
import {
  CreateUserDTO,
  CreateUserErrors,
  CreateUserUseCase,
} from './useCases/createUser';

@Controller('auth')
export class AuthController extends BaseController {
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
            return this.conflict(res, error.errorValue().message);
          case CreateUserErrors.EmailAlreadyExistsError:
            return this.conflict(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue());
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
