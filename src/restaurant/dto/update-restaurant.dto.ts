import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, IsEnum, MinLength, IsOptional, IsEmail } from 'class-validator';
import { Category } from '../schema/restaurant.schema';


export class UpdateRestaurantDetailsDto {
    @ApiProperty({
        name: 'Name',
        description: 'Restaurant Name',
        required: true,
        type: String,
        maxLength: 256,
        uniqueItems: true
    })
    @IsString()
    @IsOptional()
    name: string

    @ApiProperty({
        name: 'Email',
        description: 'Restaurant Email',
        required: true,
        type: String
    })
    @IsString()
    @IsOptional()
    @IsEmail()
    email: string

    @ApiProperty({
        name: 'Description',
        description: 'Restaurant Description',
        required: true,
        type: String,
        maxLength: 256
    })
    @IsString()
    @IsOptional()
    @MinLength(10)
    description: string

    @ApiProperty({
        name: 'Category',
        enum: Category,
        description: 'Restaurant Category'
    })
    @IsOptional()
    @IsEnum(Category, { message: 'Please, enter the correct category' })
    category: Category

    @ApiProperty({
        name: 'PhoneNumber',
        description: 'Restaurant PhoneNumber',
        type: String,
    })
    @IsString()
    @IsOptional()
    @IsPhoneNumber('EG')
    phoneNo: string

    @ApiProperty({
        name: 'Address',
        description: 'Restaurant Address',
        required: false,
        type: String
    })
    @IsString()
    @IsOptional()
    @MinLength(6)
    address: string
}