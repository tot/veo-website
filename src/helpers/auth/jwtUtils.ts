import jwt from "jsonwebtoken"

/**
 * Returns the payload of a JWT token
 * @param token JWT Token to process
 * @returns The payload of the token, given the token is valid
 */
export function getJWTPayload(token: string) {
    // Get JWT from Authorization header
   return jwt.verify(token, process.env.NEXTAUTH_SECRET) as any
}
