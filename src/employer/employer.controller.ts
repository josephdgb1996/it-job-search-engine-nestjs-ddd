import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { BaseController } from 'shared/core';

import {
  CreateEmployerDTO,
  CreateEmployerErrors,
  CreateEmployerUseCase,
} from './useCases/createEmployer';

@Controller('employer')
export class EmployerController extends BaseController {
  private logger = new Logger('EmployerController');

  constructor(private createEmployerUseCase: CreateEmployerUseCase) {
    super();
  }

  @Post()
  async createEmployer(
    @Body() createEmployerDto: CreateEmployerDTO,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.createEmployerUseCase.execute(
        createEmployerDto,
      );

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateEmployerErrors.UserDoesntExistError:
          case CreateEmployerErrors.EmployerAlreadyExistsError:
            this.logger.error(error.errorValue().message);
            return this.conflict(res, error.errorValue().message);

          default:
            this.logger.error(error.errorValue());
            return this.fail(res, error.errorValue());
        }
      }

      this.logger.verbose(`Employer successfully created`);
      return this.ok(res);
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
