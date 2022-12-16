import { Restaurant } from './../../restaurant/schema/restaurant.schema';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from "../schema/meal.schema"
import { Type } from 'class-transformer';

export class CreateMealDto {
    @ApiProperty({
        description: 'Enter Name Of Meal',
        required: true,
        uniqueItems: true,
        example: 'Koshary'
    })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: 'Enter The Description Of Meal! Must More than 6 letter',
        required: true,
        example: 'Mixture of Rice, Macaroni, and Lentils'
    })
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty({
        description: 'Enter The Price Of Meal',
        required: true,
        example: 23
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    price: number

    @ApiProperty({
        enum: Category,
        description: 'Enter Category Of Meal',
        required: true
    })
    @IsEnum(Category, { message: 'Please, enter the correct category' })
    @IsNotEmpty()
    category:Category

    @ApiProperty({
        example: '639a5796f5c0bf098d83abb5'
    })
    @IsNotEmpty()
    @IsString()
    restaurant: string
}