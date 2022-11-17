/** Decrypted JWT Content  */
export type AccessTokenPayload = {

    /**
     * User ID Used
     */
    sub: string

    /**
     * User Role
     * example: "USER"
     */

    userRole: string
}