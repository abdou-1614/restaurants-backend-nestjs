
/**
 * Used to extend another exception to make it
 * instanceof AuthServiceInputException
 */
export class AuthServiceInputException extends Error {

    constructor(message :string) {

        super(message)

    }
}