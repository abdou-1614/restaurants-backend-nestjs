import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"

export class CreateReviewDto {
    @ApiProperty({
        example: 'Amazing Restaurant'
    })
    @IsString()
    @IsNotEmpty()
    review: string

    @ApiProperty({
        example: 5
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    rating: number
}