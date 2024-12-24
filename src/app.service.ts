import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomerService } from './customer/customer.service';
import { generateOTP, hashPassword } from './utils/functions/functions';

@Injectable()
export class AppService {
  constructor(
    private readonly customerService: CustomerService,
  ){}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto, 'createUserDto');
    const { password, ...rest } = createUserDto;
    let hashed_pass = await hashPassword(password);
    const token = generateOTP();
    console.log(token, 'token');
    const expires_at = new Date().setDate(
      new Date().getDate() + Number(process.env.OTP_EXPIRATION_DAYS),
    );

    // if (createUserDto.phone_no) {
    //   await this.twilioService.client.verify.v2
    //     .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    //     .verifications.create({
    //       to: `+${createUserDto.phone_no}`,
    //       channel: 'sms',
    //     })
    //     .then(async (verification) => {
    //       console.log(verification);
    //     })
    //     .catch((e) => {
    //       this.emailService.send_verification_email(createUserDto.email, {
    //         name: createUserDto.first_name,
    //         url: `${process.env.UI_URL}/auth/new-password?token=${token}&email=${createUserDto.email}`,
    //         OTP: token,
    //       });
    //     });
    // }

    await this.customerService.create({
      ...rest,
      password: hashed_pass,
      verification: {
        token: token,
        expiry: expires_at,
        is_verified: false,
      },
    });

    let logged_in_token = await this.customerService.generateToken({
      email: createUserDto.email,
      phone_no: createUserDto.phone_no,
    });

    return {
      message: 'User created successfully.',
      token: logged_in_token,
    };
  }
}
