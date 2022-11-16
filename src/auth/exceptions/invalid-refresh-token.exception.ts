import { AuthServiceInputException } from './auth-service-input.exception';
export class InvalidRefreshTokenException extends AuthServiceInputException {
    constructor() {
        super('Invalid Refresh Token')
    }
}