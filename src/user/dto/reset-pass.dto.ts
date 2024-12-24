import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({
        type: String
    })
    token: string

    @ApiProperty({
        type: String
    })
    @IsEmail()
    email: string

    @ApiProperty({
        type: String
    })
    pass: string

    @ApiProperty({
        type: String
    })
    confirm_pass: string
}