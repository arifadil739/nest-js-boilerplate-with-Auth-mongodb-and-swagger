import { ApiProperty } from "@nestjs/swagger"

export class ChangePasswordDto{
    @ApiProperty({
        type:String
    })
    current_pass: string

    @ApiProperty({
        type:String
    })
    new_pass: string

    @ApiProperty({
        type:String
    })
    confirm_new_pass: string
}