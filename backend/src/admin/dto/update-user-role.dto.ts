import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/users/entities/user.entity';

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}