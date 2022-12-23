import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsPositive } from "class-validator"

export class FindReviewQueryDto {

    @ApiProperty({
        name: 'limit',
        description: 'Number Of Items Per Page, Example: "10"',
        required: false
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit?: number

    @ApiProperty({
        name: 'page',
        description: 'Number Of Page',
        required: false
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    page?: number
}