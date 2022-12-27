import { match } from "../regex"
import { prisma } from "../db"

/**
 * Check if account email is valid
 * @param email Email to check
 * @returns Array of errors. Array is empty if there are no errors.
 */
export function validateEmail(email: string) {
   let errors: string[] = []
   if (
      !email ||
      !match(email, "(^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@virginia.edu)")
   ) {
      errors.push("Email is invalid.")
   }
   return errors
}

/**
 * Check if account email does not exist in the database
 * @param email Email to check
 * @returns Array of errors. Array is empty if there are no errors.
 */
export async function validateEmailNotExists(email: string) {
    let errors: string[] = []
 
    // Check database if email is used
    let existingUser = await prisma.user.findUnique({
       where: {
          email: email,
       },
    })
    if (existingUser) {
       errors.push("An account with that email exists.")
    }
    return errors
 }

 /**
 * Check if account email exists in the database
 * @param email Email to check
 * @returns Array of errors. Array is empty if there are no errors.
 */
 export async function validateEmailExists(email: string) {
    let errors: string[] = []
 
    // Check database if email is used
    let existingUser = await prisma.user.findUnique({
       where: {
          email: email,
       },
    })
    if (!existingUser) {
       errors.push("An account with that email does not exist.")
    }
    return errors
 }