import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator"

export class FilterQueryDto {
    @ApiProperty({
        name: 'Page',
        description: 'Number Of Page',
        required: false
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    page?: number

    @ApiProperty({
        name: 'Limit',
        description: 'Number Of Items Per Page, Example: "10"',
        required: false
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit?: number

    @ApiProperty({
        name: 'Sort',
        description: 'Sort The Result By One Or More',
        required: false
    })
    @IsString()
    @IsOptional()
    sort?: string

    @ApiProperty({
        name: 'search',
        description: 'Search And Return The Result',
        required: false
    })
    @IsString()
    @IsOptional()
    search?: string
}