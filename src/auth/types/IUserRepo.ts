import { User } from '../domain';

export interface IUserRepo {
  exists(email: string): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByUsername(username: string): Promise<User>;
  persist(user: User): Promise<void>;
}
