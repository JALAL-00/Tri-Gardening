import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  
  private async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async getProfile(user: User): Promise<User> {
    return this.findUserById(user.id);
  }

  async updateProfile(user: User, updateProfileDto: UpdateProfileDto): Promise<{ accessToken: string }> {
    const userToUpdate = await this.findUserById(user.id);
    
    Object.assign(userToUpdate, updateProfileDto);
    
    try {
      const updatedUser = await this.userRepository.save(userToUpdate);
      
      const payload = { id: updatedUser.id, phone: updatedUser.phone, role: updatedUser.role };
      const accessToken = this.jwtService.sign(payload);
      
      return { accessToken };

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email address is already in use.');
      }
      throw error;
    }
  }

  async updateProfilePicture(user: User, filePath: string): Promise<User> {
    const userToUpdate = await this.findUserById(user.id);
    
    userToUpdate.profilePictureUrl = filePath;
    return this.userRepository.save(userToUpdate);
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const userWithPassword = await this.userRepository.createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.id = :id", { id: user.id })
        .getOne();

    if (!userWithPassword) {
      throw new NotFoundException('User not found.');
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect current password.');
    }
    
    const salt = await bcrypt.genSalt();
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    
    await this.userRepository.update(user.id, {
        password: newHashedPassword
    });

    return { message: 'Password changed successfully.' };
  }

  async getReferralSummary(user: User): Promise<any> {
    const currentUser = await this.findUserById(user.id);
    return {
      referralCode: currentUser.referralCode,
      totalEarned: 3400,
      creditsUsed: 600,
      successfulReferrals: 12,
    };
  }
}
