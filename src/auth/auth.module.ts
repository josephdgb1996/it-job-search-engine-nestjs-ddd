import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';

import { CreateUserUseCase } from './useCases/createUser';
import { LoginUserUseCase } from './useCases/loginUser';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [CreateUserUseCase, LoginUserUseCase, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
