// src/auth/guards/admin.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. First, run the standard JWT authentication
    const baseActivation = await super.canActivate(context);
    if (!baseActivation) {
      return false;
    }

    // 2. If token is valid, check for admin role
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role === UserRole.ADMIN;
  }
}