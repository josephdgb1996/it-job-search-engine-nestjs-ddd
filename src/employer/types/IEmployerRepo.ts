import { Employer } from '../domain/employer';

export interface IEmployerRepo {
  exists(userId: string): Promise<boolean>;
  getEmployerByUserId(userId: string): Promise<Employer>;
  persist(employer: Employer): Promise<void>;
}
