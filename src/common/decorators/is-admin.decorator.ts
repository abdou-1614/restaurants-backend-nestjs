import { RoleGuards } from './../guards/role.guard';
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const IS_ADMIN = 'isAdmin'


export function IsAdmin(): <T> (
    target: object | T,
    propertyKey?: string | symbol
) => void {
    return applyDecorators(
        SetMetadata(IS_ADMIN, true),
        UseGuards(RoleGuards),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'UNAUTHORIZED' }),
        ApiForbiddenResponse({ description: 'Forbidden resource' })
    )
}