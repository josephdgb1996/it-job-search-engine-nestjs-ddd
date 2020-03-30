import { Result, UseCaseError } from 'shared/core';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GetEmployerErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor (userId: string) {
      super(false, {
        message: `Couldn't find a user with the userId ${userId}`
      } as UseCaseError)
    }
  }

  export class EmployerNotFoundError extends Result<UseCaseError> {
    constructor (userId: string) {
      super(false, {
        message: `Couldn't find a employer with the userId ${userId}`
      } as UseCaseError)
    }
  }
}