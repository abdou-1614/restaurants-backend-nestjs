import { JwtSignOptions } from "@nestjs/jwt";

export const accessTokenConfig: JwtSignOptions = {
    secret: process.env.ACCESS_JWT_SECRET,
    expiresIn: '15m',
}

export const refreshTokenConfig: JwtSignOptions = {
    secret: process.env.REFRESH_JWT_SECRET,
    expiresIn: '90d',
}