// src/profile/profile.controller.ts
import {
  Body, Controller, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CustomerGuard } from 'src/auth/guards/customer.guard';
import { User } from 'src/users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@UseGuards(CustomerGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get()
  getProfile(@GetUser() user: User) {
    return this.profileService.getProfile(user);
  }

  @Put()
  updateProfile(@GetUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(user, updateProfileDto);
  }

  @Post('picture')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profiles',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.mimetype.split('/').pop();
        const userId = (req.user as User)?.id || 'unknown';
        cb(null, `${userId} -${uniqueSuffix}.${extension} `);
      },
    }),
  }))
  async updateProfilePicture(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      console.log('Upload request received');
      console.log('File:', file);

      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // Manual validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new BadRequestException('File size exceeds 5MB limit');
      }

      const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.mimetype}. Allowed types: JPEG, PNG, WebP`);
      }

      console.log('File validation passed:', file.filename, file.mimetype, file.size);

      const filePath = `/uploads/profiles/${file.filename}`;
      const result = await this.profileService.updateProfilePicture(user, filePath);

      console.log('Profile picture updated successfully');
      return result;
    } catch (error) {
      console.error('Error in updateProfilePicture controller:', error.message, error.stack);
      throw error;
    }
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
