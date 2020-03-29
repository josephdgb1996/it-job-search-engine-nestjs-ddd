import { AggregateRoot, UniqueEntityID } from 'shared/domain';
import { Guard, Result } from 'shared/core';

import { EmployerId } from './employerId';
import { CompanyName } from './companyName';
import { UserId } from '../../auth/domain';
import { CompanyDescription } from './companyDescription';

interface EmployerProps {
  userId: UserId;
  companyName: CompanyName;
  companyDescription: CompanyDescription;
}

export class Employer extends AggregateRoot<EmployerProps> {
  get employerId(): EmployerId {
    return EmployerId.create(this._id).getValue();
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get companyName(): CompanyName {
    return this.props.companyName;
  }

  get companyDescription(): CompanyDescription {
    return this.props.companyDescription;
  }

  private constructor(props: EmployerProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: EmployerProps,
    id?: UniqueEntityID,
  ): Result<Employer> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.companyName, argumentName: 'companyName' },
      {
        argument: props.companyDescription,
        argumentName: 'companyDescription',
      },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail(guardResult.message!);
    }

    const employer = new Employer(props, id);

    return Result.ok(employer);
  }
}
