import { Mapper } from 'shared/core';
import { UniqueEntityID } from 'shared/domain';

import { User, UserEmail, UserName, UserPassword } from './domain';
import { UserDTO } from './dtos';
import { UserEntity } from './user.entity';

export class UserMap implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      username: user.username.value,
      // isEmailVerified: user.isEmailVerified,
      isAdminUser: user.isAdminUser,
      isDeleted: user.isDeleted,
    };
  }

  public static toDomain(entity: UserEntity): User {
    const userNameOrError = UserName.create({ value: entity.username });
    const userEmailOrError = UserEmail.create({ value: entity.email });
    const userPasswordOrError = UserPassword.create({
      value: entity.password,
      hashed: true,
    });

    const userOrError = User.create(
      {
        username: userNameOrError.getValue(),
        isAdminUser: entity.isAdminUser,
        isDeleted: entity.isDeleted,
        // isEmailVerified: raw.is_email_verified,
        password: userPasswordOrError.getValue(),
        email: userEmailOrError.getValue(),
      },
      new UniqueEntityID(entity.userId),
    );

    !userOrError.isSuccess ? console.log(userOrError.error) : '';

    return userOrError.getValue();
  }

  public static async toPersistence(user: User): Promise<Partial<UserEntity>> {
    let password;
    if (!!user.password) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    return {
      userId: user.userId.id.toString(),
      email: user.email.value,
      // is_email_verified: user.isEmailVerified,
      username: user.username.value,
      password: password,
      isAdminUser: user.isAdminUser,
      isDeleted: user.isDeleted,
    };
  }
}
