// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/common/email.service';
import { JwtStrategy } from './jwt.strategy'; // ✅ Added import

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Required for injecting User repository
    UsersModule, // Import UsersModule to use UsersService
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '7d', // Token valid for 7 days
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    EmailService,
    JwtStrategy, // ✅ Added JwtStrategy
  ],
  controllers: [AuthController],
  exports: [
    PassportModule,
    JwtStrategy, // ✅ Exported JwtStrategy
  ],
})
export class AuthModule {}
