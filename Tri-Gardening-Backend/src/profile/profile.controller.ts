// src/profile/profile.controller.ts
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CustomerGuard } from 'src/auth/guards/customer.guard';
import { User } from 'src/users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@UseGuards(CustomerGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@GetUser() user: User) {
    return this.profileService.getProfile(user);
  }

  @Put()
  updateProfile(@GetUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(user, updateProfileDto);
  }

  @Put('change-password')
  changePassword(@GetUser() user: User, @Body() changePasswordDto: ChangePasswordDto) {
    return this.profileService.changePassword(user, changePasswordDto);
  }

  @Get('referral-summary')
  getReferralSummary(@GetUser() user: User) {
    return this.profileService.getReferralSummary(user);
  }
}
