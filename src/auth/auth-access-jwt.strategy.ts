import { AccessTokenContent } from './types/access-token-content';
import { AccessTokenPayload } from './types/access-token-payload';
import { accessTokenConfig } from './../config/jwt.config';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('ACCESS_JWT_SECRET')
        })
    }


    /**
     * Validates and returns data after JWT is decrypted
     */
    async validate(payload: AccessTokenPayload): Promise<AccessTokenContent> {
        return {
            userId: payload.sub,
            userRole: payload.userRole
        }
    }
}