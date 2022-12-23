import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class UpdateReviewDto {
    @ApiProperty({
        example: 'Amazing Restaurant'
    })
    @IsString()
    @IsOptional()
    review: string

    @ApiProperty({
        example: 5
    })
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsOptional()
    @Type(() => Number)
    rating: number
}