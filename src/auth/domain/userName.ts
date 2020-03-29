import { ValueObject } from 'shared/domain';
import { Guard, Result } from 'shared/core';

interface UserNameProps {
  value: string;
}

export class UserName extends ValueObject<UserNameProps> {
  public static maxLength = 15;
  public static minLength = 2;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserNameProps) {
    super(props);
  }

  public static create(props: UserNameProps): Result<UserName> {
    const usernameResult = Guard.againstNullOrUndefined(props.value, 'username');
    if (!usernameResult.succeeded) {
      return Result.fail<UserName>(usernameResult.message!);
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.value);
    if (!minLengthResult.succeeded) {
      return Result.fail<UserName>(minLengthResult.message!);
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.value);
    if (!maxLengthResult.succeeded) {
      return Result.fail<UserName>(minLengthResult.message!);
    }

    return Result.ok<UserName>(new UserName(props));
  }
}
