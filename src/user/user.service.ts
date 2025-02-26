import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { ChangePasswordDto } from './dto/change-pass.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-pass.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateOTP } from '../utils/functions/functions';
import { User, UserDocument } from '../schemas/user.schema';

interface IUser {
  email: string;
  phone_no: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    
    private readonly jwtService: JwtService,
    // private emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    let hashed_pass = await this.hashPassword(password);
    const token = generateOTP();
    const expires_at = new Date().setDate(
      new Date().getDate() + Number(process.env.OTP_EXPIRATION_DAYS),
    );
    await this.userModel.create({
      ...rest,
      password: hashed_pass,
      verification: {
        token: token,
        expiry: expires_at,
        isVerified: false,
      },
    });

    let logged_in_token = await this.generateToken({
      email: createUserDto.email,
      phone_no: createUserDto.phone_no,
    });

    return {
      message: 'User created successfully.',
      token: logged_in_token,
    };
  }

  async verifyAccount(token: string, email: string) {
    let user_exists = await this.findByEmail(email);
    if (!user_exists) {
      throw new NotFoundException('No user found with this email.');
    }
    
    if (token !== String(user_exists.verification.token)) {
      throw new BadRequestException('Invalid Token');
    }

    user_exists.verification.is_verified = true;
    let jwt_token = await this.generateToken({
      email: user_exists.email,
      phone_no: user_exists.phone_no,
    });
    await user_exists.save();

    return {
      token: jwt_token,
      message: 'User verified successfully.',
    };
  }

  async login(loginDto: LoginUserDto) {
    let user = await this.validateUser(loginDto);

    let token = await this.generateToken({
      email: loginDto.email,
      phone_no: user.phone_no,
    });
    return {
      data: {
        token: token,
        is_verified: user.verification.is_verified,
        user: user,
      },
      message: 'User logged in successfully',
    };
  }

  async forgotPassword(email: string) {
    let user_exists = await this.findByEmail(email);
    if (!user_exists) {
      throw new NotFoundException('No user exists with this email.');
    }

    let token = await this.generateToken({
      email: email,
      phone_no: user_exists.phone_no,
    });
    const expires_at = new Date().setDate(
      new Date().getDate() + Number(process.env.OTP_EXPIRATION_DAYS),
    );
    user_exists.passwordUpdate = {
      token,
      expiry: expires_at,
      password_updated_at: null,
    };
    await user_exists.save();

    // this.emailService.send_forgot_pass_email(user_exists.email, {
    //   name: user_exists.first_name,
    //   url: `${process.env.UI_URL}auth/new-password?token=${token}&email=${user_exists.email}`,
    // });
    
    return {
      data: {
        token: token,
      },
    };
  }

  async updateProfile(id: any, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntityException('Please enter a valid id');
    }
    let user_exist = await this.userModel.findById(id);
    if (!user_exist) {
      throw new NotFoundException('No user found with this id');
    }
    let updated_user = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    return updated_user;
  }

  async resetPassword(resetPassDto: ResetPasswordDto) {
    console.log(resetPassDto, 'resetPassDto');
    let user_exists = await this.findByEmail(resetPassDto.email);
    if (!user_exists) {
      throw new NotFoundException('User with this email does not exists.');
    }

    if (resetPassDto.pass != resetPassDto.confirm_pass) {
      throw new BadRequestException(
        'Password and confirm password must match.',
      );
    }

    let validate_token = user_exists.passwordUpdate.token == resetPassDto.token;
    if (!validate_token) {
      throw new BadGatewayException('Token is expired or incorrect.');
    }

    let current_time = Date.now();
    let token_expired = current_time > user_exists.passwordUpdate.expiry;
    if (token_expired) {
      throw new BadGatewayException('Token is expired.');
    }
    let hashed_pass = await this.hashPassword(resetPassDto.pass);
    user_exists.passwordUpdate.expiry = null;
    user_exists.passwordUpdate.token = '';
    user_exists.passwordUpdate.password_updated_at = Date.now();
    user_exists.password = hashed_pass;
    await user_exists.save();

    return {
      message: 'Password updated successfully',
    };
  }

  async logout(user_id: mongoose.Types.ObjectId) {
    await this.userModel.findByIdAndUpdate(user_id, {
      isLoggedIn: false,
      notification_token: '',
    });
    return {
      message: 'Logged out successfully.',
    };
  }

  async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  async changePassword(authUser: any, changePassDto: ChangePasswordDto) {
    let match = await this.comparePassword(
      changePassDto.current_pass,
      authUser.password,
    );
    if (!match) {
      throw new UnauthorizedException('Please enter a valid password.');
    }
    if (changePassDto.new_pass != changePassDto.confirm_new_pass) {
      throw new UnauthorizedException(
        'Password and confirm password must be same.',
      );
    }
    let hashed_pass = await this.hashPassword(changePassDto.new_pass);
    authUser.password = hashed_pass;
    await authUser.save();

    return {
      message: 'Password successfully changed',
    };
  }
  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email: email });
  }
  async validateUser(loginDto: LoginUserDto) {
    let user_exists = await this.findByEmail(loginDto.email);
    if (!user_exists) {
      throw new NotFoundException('No user found with this email.');
    }

    let match_pass = await this.comparePassword(
      loginDto.password,
      user_exists.password,
    );
    if (!match_pass) {
      throw new BadRequestException('Please enter a valid password');
    }

    return user_exists;
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async generateToken(user: IUser) {
    const token = await this.jwtService.signAsync(user, { expiresIn: '1d' });
    return token;
  }

  async decodeToken(token: string) {
    const t = await this.jwtService.verify(token);
    return t;
  }
}