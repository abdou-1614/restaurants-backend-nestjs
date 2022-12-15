import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { Category } from '../schema/meal.schema';

export class UpdateMealDto {
    @ApiProperty({
        description: 'Enter Name Of Meal',
        required: true,
        uniqueItems: true,
    })
    @IsString()
    @IsOptional()
    name: string

    @ApiProperty({
        description: 'Enter The Description Of Meal! Must More than 6 letter',
        required: true,
    })
    @IsString()
    @IsOptional()
    description: string

    @ApiProperty({
        description: 'Enter The Price Of Meal',
        required: true,
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    price: number

    @ApiProperty({
        enum: Category,
        description: 'Enter Category Of Meal',
        required: true
    })
    @IsEnum(Category, { message: 'Please, enter the correct category' })
    @IsOptional()
    category:Category

    @ApiProperty()
    @IsOptional()
    @IsString()
    restaurant: string
}