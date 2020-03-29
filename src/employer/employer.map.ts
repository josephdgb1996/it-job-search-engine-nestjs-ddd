import { Mapper } from 'shared/core';
import { UniqueEntityID } from 'shared/domain';

import { Employer } from './domain/employer';
import { EmployerEntity } from './employer.entity';
import { UserId } from '../auth/domain';
import { CompanyName } from './domain/companyName';
import { CompanyDescription } from './domain/companyDescription';

export class EmployerMap implements Mapper<Employer> {
  public static toDomain(entity: EmployerEntity): Employer {
    const userIdOrError = UserId.create(new UniqueEntityID(entity.userId));
    const companyNameOrError = CompanyName.create({
      value: entity.companyName,
    });
    const companyDescriptionOrError = CompanyDescription.create({
      value: entity.companyDescription,
    });

    const employerOrError = Employer.create(
      {
        userId: userIdOrError.getValue(),
        companyName: companyNameOrError.getValue(),
        companyDescription: companyDescriptionOrError.getValue(),
      },
      new UniqueEntityID(entity.employerId),
    );

    !employerOrError.isSuccess ? console.log(employerOrError.error) : '';

    return employerOrError.getValue();
  }

  public static toPersistence(employer: Employer): Partial<EmployerEntity> {
    return {
      employerId: employer.employerId.id.toString(),
      companyName: employer.companyName.value,
      companyDescription: employer.companyDescription.value,
      userId: employer.userId.id.toString(),
    };
  }
}
