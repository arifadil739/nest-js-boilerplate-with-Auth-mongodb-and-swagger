import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-pass.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-pass.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from './guards/jwt-guard';
import { AuthUser } from './decorator/get-token.decorator';


@ApiTags('User')
@ApiBearerAuth('userBearerAuth')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('verify-account-email/:token')
  @ApiQuery({ name: 'email', type: String, required: true })
  async verifyAccountByEmail(
    @Param('token') token: string,
    @Query('email') email: string,
  ) {
    console.log(token, 'token');
    return await this.userService.verifyAccount(token, email);
  }


  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return await this.userService.login(loginDto);
  }
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-pass')
  async changePassword(
    @AuthUser() authUser,
    @Body() changePassDto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(authUser, changePassDto);
  }

  @Post('forgot-pass')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
      },
    },
  })
  async forgotPassword(@Body() body: { email: string }) {
    return await this.userService.forgotPassword(body.email);
  }

  @Post('reset-pass')
  async resetPassword(@Body() resetPassDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profile_picture', maxCount: 1 },
      { name: 'cover_photo', maxCount: 1 },
    ]),
  )
  async updateProfile(
    @UploadedFiles()
    files: {
      profile_picture: File[];
      cover_photo: File[];
    },
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser,
  ) {
    // const uploaded_image_promise =
    //   files && files.profile_picture
    //     ? (
    //         await this.s3Service.uploadFile(
    //           files.profile_picture[0],
    //           `${String(authUser._id)}/profile-pictures/${
    //             files.profile_picture[0]['originalname']
    //           }`,
    //         )
    //       ).Location
    //     : '';
    // const uploaded_cover_promise =
    //   files && files.cover_photo
    //     ? (
    //         await this.s3Service.uploadFile(
    //           files.cover_photo[0],
    //           `${String(authUser._id)}/profile-pictures/${
    //             files.cover_photo[0]['originalname']
    //           }`,
    //         )
    //       ).Location
    //     : '';

    // const [uploaded_image_file, uploaded_cover_file] = await Promise.all([
    //   uploaded_image_promise,
    //   uploaded_cover_promise,
    // ]);
    // if (uploaded_image_file == '' && isURL(authUser.profile_picture)) {
    //   console.log('not updating already updated');
    // } else {
    //   updateUserDto.profile_picture = uploaded_image_file;
    // }
    // if (uploaded_cover_file == '' && isURL(authUser.cover_photo)) {
    //   console.log('not updating already updated');
    // } else {
    //   updateUserDto.cover_photo = uploaded_cover_file;
    // }
    return await this.userService.updateProfile(authUser._id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('logout')
  async logout(@AuthUser() authUser) {
    return await this.userService.logout(authUser._id);
  }
}