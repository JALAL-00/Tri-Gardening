import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class CustomerGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const baseActivation = await super.canActivate(context);
    if (!baseActivation) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Allow if user is either a customer OR an admin (admins can often impersonate users)
    return user && (user.role === UserRole.CUSTOMER || user.role === UserRole.ADMIN);
  }
}