import { EntityRepository, Repository } from 'typeorm';

import { IEmployerRepo } from './types';
import { Employer } from './domain';
import { EmployerMap } from './employer.map';
import { EmployerEntity } from './employer.entity';

@EntityRepository(EmployerEntity)
export class EmployerRepository extends Repository<EmployerEntity>
  implements IEmployerRepo {
  async exists(userId: string): Promise<boolean> {
    const existingEmployer = await this.createQueryBuilder("employer")
      .where('employer.userId = :userId', {
        userId,
      })
      .getOne();

    return !!existingEmployer;
  }

  async getEmployerByUserId(userId: string): Promise<Employer> {
    const employer = await this.createQueryBuilder("employer")
      .where('employer.userId = :userId', {
        userId,
      })
      .getOne();

    if (!employer) throw new Error('Employer not found');

    return EmployerMap.toDomain(employer);
  }

  async persist(employer: Employer): Promise<void> {
    const employerExists = await this.exists(employer.userId.id.toString());

    if (!!employerExists) return;

    const userEntity = await EmployerMap.toPersistence(employer);

    await this.create(userEntity).save();
  }
}
