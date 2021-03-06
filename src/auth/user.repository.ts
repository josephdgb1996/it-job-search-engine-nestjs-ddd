import { EntityRepository, Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { IUserRepo } from './types';
import { User } from './domain';
import { UserMap } from './user.map';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>
  implements IUserRepo {
  async exists(email: string): Promise<boolean> {
    const existingUser = await this.createQueryBuilder()
      .where('email = :email', {
        email,
      })
      .getOne();

    return !!existingUser;
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.findOne({ username });

    if (!user) throw new Error('User not found');

    return UserMap.toDomain(user);
  }

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.findOne({ userId });

    if (!user) throw new Error('User not found');

    return UserMap.toDomain(user);
  }

  async persist(user: User): Promise<void> {
    const userExists = await this.exists(user.email.props.value);

    if (!!userExists) return;

    const userEntity = await UserMap.toPersistence(user);

    await this.create(userEntity).save();
  }
}
