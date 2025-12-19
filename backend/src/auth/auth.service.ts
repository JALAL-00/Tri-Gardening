import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Services
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/common/email.service';

// Entities & DTOs
import { User } from 'src/users/entities/user.entity';
import { Referral } from 'src/users/entities/referral.entity'; // Make sure this entity exists
import { RegisterUserDto } from './dto/register-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,
    private readonly emailService: EmailService,
  ) {}

  // A helper function to generate a 6-digit OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // --- METHOD 1: REGISTER ---
  async register(registerUserDto: RegisterUserDto): Promise<{ accessToken: string }> {
    const { fullName, phone, email, password, address, referralCode } = registerUserDto;

    const existingUser = await this.usersService.findOneByPhone(phone);
    if (existingUser) {
      throw new ConflictException('User with this phone number already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userToCreate: CreateUserDto = {
      fullName,
      phone,
      email,
      password: hashedPassword,
      addresses: [address],
    };

    let newUser: User;
    try {
      newUser = await this.usersService.create(userToCreate);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('A user with that email or phone already exists.');
      }
      console.error(error);
      throw new InternalServerErrorException('An unexpected error occurred.');
    }

    // --- REFERRAL LOGIC START ---
    if (referralCode) {
      const referrer = await this.userRepository.findOne({ where: { referralCode } });
      if (referrer) {
        // Create a pending referral record
        const referral = this.referralRepository.create({
          referrer: referrer,
          referredUser: newUser,
          status: 'pending',
          commissionEarned: 0,
        });
        await this.referralRepository.save(referral);
        console.log(`Referral tracked: ${referrer.fullName} invited ${newUser.fullName}`);
      }
    }
    // --- REFERRAL LOGIC END ---

    const payload = { id: newUser.id, phone: newUser.phone, role: newUser.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  // --- METHOD 2: LOGIN ---
  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { phone, password } = loginUserDto;
    const user = await this.usersService.findOneByPhone(phone);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, phone: user.phone, role: user.role };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException('Please check your login credentials');
  }

  // --- METHOD 3: FORGOT PASSWORD (OTP Flow) ---
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.email) {
      return { message: 'If an account with this email exists, a password reset OTP has been sent.' };
    }

    const otp = this.generateOtp();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // OTP is valid for 10 minutes

    user.passwordResetOtp = otp;
    user.otpExpires = expires;
    await this.userRepository.save(user);

    const emailHtml = `
      <p>Hello ${user.fullName},</p>
      <p>You requested a password reset for your TriGardening account.</p>
      <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await this.emailService.sendMail(user.email, 'TriGardening - Password Reset OTP', emailHtml);
    return { message: 'If an account with this email exists, a password reset OTP has been sent.' };
  }

  // --- METHOD 4: RESET PASSWORD (OTP Flow) ---
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, otp, newPassword } = resetPasswordDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user || !user.passwordResetOtp || !user.otpExpires) {
      throw new BadRequestException('Invalid password reset request.');
    }

    const isOtpValid = user.passwordResetOtp === otp;
    const isOtpExpired = user.otpExpires < new Date();

    if (!isOtpValid || isOtpExpired) {
      throw new BadRequestException('The OTP is invalid or has expired.');
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);

    // Invalidate the OTP after use
    user.passwordResetOtp = null;
    user.otpExpires = null;

    await this.userRepository.save(user);

    return { message: 'Password has been reset successfully.' };
  }
}