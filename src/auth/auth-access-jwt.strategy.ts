import { AccessTokenContent } from './types/access-token-content';
import { AccessTokenPayload } from './types/access-token-payload';
import { accessTokenConfig } from './../config/jwt.config';
import { PassportStrategy } from "@nestjs/passport/dist";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: accessTokenConfig.secret
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