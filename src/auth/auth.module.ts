import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CreateUserUseCase } from './useCases/createUser/CreateUserUseCase';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [CreateUserUseCase],
})
export class AuthModule {}
