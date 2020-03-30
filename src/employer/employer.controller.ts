import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { BaseController } from 'shared/core';

import {
  CreateEmployerDTO,
  CreateEmployerErrors,
  CreateEmployerUseCase,
} from './useCases/createEmployer';
import { GetEmployerErrors, GetEmployerUseCase } from './useCases/getEmployer';

@Controller('employer')
@UseGuards(AuthGuard())
export class EmployerController extends BaseController {
  private logger = new Logger('EmployerController');

  constructor(
    private createEmployerUseCase: CreateEmployerUseCase,
    private getEmployerUseCase: GetEmployerUseCase,
  ) {
    super();
  }

  @Post()
  async createEmployer(
    @Body() createEmployerDto: CreateEmployerDTO,
    @Res() res: Response,
    @Req() req,
  ): Promise<any> {
    try {
      const result = await this.createEmployerUseCase.execute(
        createEmployerDto,
        req.user.userId,
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
            return this.fail(res, error.errorValue() as any);
        }
      }

      this.logger.verbose(`Employer successfully created`);
      return this.ok(res);
    } catch (err) {
      return this.fail(res, err);
    }
  }

  @Get()
  async getEmployer(@Res() res: Response, @Req() req): Promise<any> {
    try {
      const result = await this.getEmployerUseCase.execute(req.user);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case GetEmployerErrors.UserNotFoundError:
          case GetEmployerErrors.EmployerNotFoundError:
            this.logger.error(error.errorValue().message);
            return this.notFound(res, error.errorValue().message);

          default:
            this.logger.error(error.errorValue());
            return this.fail(res, error.errorValue() as any);
        }
      }

      this.logger.verbose(`Employer data successfully returned`);
      return this.ok(res, result.value.getValue());
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
