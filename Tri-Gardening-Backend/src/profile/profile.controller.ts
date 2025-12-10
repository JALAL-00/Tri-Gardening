// src/profile/profile.controller.ts
import { 
  Body, Controller, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator 
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
  constructor(private readonly profileService: ProfileService) {}

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
        const extension = file.mimetype.split('/')[1];
        cb(null, `${(req.user as User).id}-${uniqueSuffix}.${extension}`); 
      },
    }),
  }))
  updateProfilePicture(
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    ) file: Express.Multer.File
  ) {
    const filePath = `/uploads/profiles/${file.filename}`;
    return this.profileService.updateProfilePicture(user, filePath);
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
