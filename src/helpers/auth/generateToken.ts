import jwt from "jsonwebtoken"

/**
 * Generates a JWT for email verification
 * @param email Email of the user
 * @returns JSON Web Token of user for email verification
 */
export default function generateToken(email: string, expiresIn: number) {
   const data = {
      // time: Date(),
      email: email,
   }
   const token = jwt.sign(data, process.env.NEXTAUTH_SECRET, {
      expiresIn,
   })

   return token
}
