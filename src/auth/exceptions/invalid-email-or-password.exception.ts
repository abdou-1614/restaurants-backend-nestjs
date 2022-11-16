import { AuthServiceInputException } from './auth-service-input.exception';
export class InvalidEmailOrPasswordException extends AuthServiceInputException {
    constructor() {
        super('Invalid E-mail Or Password')
    }
}