// src/profile/profile.service.ts
import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(user: User): Promise<User> {
    const fullUserProfile = await this.userRepository.findOne({ where: { id: user.id } });
    if (!fullUserProfile) {
      throw new NotFoundException('User not found.');
    }
    return fullUserProfile;
  }

  async updateProfile(user: User, updateProfileDto: UpdateProfileDto): Promise<User> {
    Object.assign(user, updateProfileDto);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email address is already in use.');
      }
      throw error;
    }
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const userWithPassword = await this.userRepository.findOne({ where: { id: user.id } });
    if (!userWithPassword) {
      throw new NotFoundException('User not found.');
    }
    const { currentPassword, newPassword } = changePasswordDto;
    const isPasswordCorrect = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect current password.');
    }
    const salt = await bcrypt.genSalt();
    userWithPassword.password = await bcrypt.hash(newPassword, salt);
    await this.userRepository.save(userWithPassword);
    return { message: 'Password changed successfully.' };
  }

  async getReferralSummary(user: User): Promise<any> {
    return {
      referralCode: user.referralCode,
      totalEarned: 3400,
      creditsUsed: 600,
      successfulReferrals: 12,
    };
  }
}
