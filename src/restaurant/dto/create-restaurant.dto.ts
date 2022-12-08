import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiMultiFile } from 'src/common/decorators/api-multi-file.decorator';
import { ApiFile } from 'src/common/decorators/file-upload-swagger.decorator';
import { Category } from './../schema/restaurant.schema';
export class CreateRestaurantDto {
    @ApiProperty({
        name: 'Name',
        description: 'Restaurant Name',
        required: true,
        type: String,
        maxLength: 256,
        uniqueItems: true
    })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        name: 'Email',
        description: 'Restaurant Email',
        required: true,
        type: String
    })
    @IsString()
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
    @IsNotEmpty()
    @MinLength(10)
    description: string

    @IsNotEmpty()
    @ApiMultiFile({ isArray: true })
    images: Express.Multer.File[]

    @ApiProperty({
        name: 'Category',
        enum: Category,
        description: 'Restaurant Category'
    })
    @IsNotEmpty()
    @IsEnum(Category, { message: 'Please, enter the correct category' })
    category: Category

    @ApiProperty({
        name: 'PhoneNumber',
        description: 'Restaurant PhoneNumber',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('EG')
    phoneNo: string

    @ApiProperty({
        name: 'Address',
        description: 'Restaurant Address',
        required: true,
        type: String
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    address: string
}