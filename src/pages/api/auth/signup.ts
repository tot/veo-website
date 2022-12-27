import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../helpers/db"
import {
   validatePassword,
   validateEmail,
   validateEmailNotExists,
   validateName,
   hash,
} from "../../../helpers/auth"
import { RegisterBody } from "../../../types/auth"
import generateToken from "../../../helpers/auth/generateToken"
import { sendEmail } from "../../../helpers/email"

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   // Check empty body
   if (!req.body) {
      return res.status(400).json({ error: "Empty request body." })
   }

   // Check request method
   if (req.method !== "POST") {
      return res.status(405).json({ error: "Invalid HTTP method." })
   }

   const account: RegisterBody = req.body

   const passwordError = validatePassword(account.password)
   // Check criteria for emails
   const emailFormatError = validateEmail(account.email)
   const emailNotExistsError = await validateEmailNotExists(account.email)
   const emailError = [...emailFormatError, ...emailNotExistsError]

   const nameError = validateName(account.name)

   // Validate account details
   if (
      passwordError.length > 0 ||
      emailError.length > 0 ||
      nameError.length > 0
   ) {
      let errors = {
         success: false,
         email: emailError,
         password: passwordError,
         name: nameError,
      }
      return res.status(400).json(errors)
   }

   // Hash password
   const hashedPassword = await hash(account.password)
   if (!hashedPassword) {
      return res
         .status(500)
         .json({ error: "Unable to handle request at the moment." })
   }

   // Create account in DB
   try {
      await prisma.user.create({
         data: {
            name: account.name,
            email: account.email,
            accountVerified: false,
            password: hashedPassword,
            role: "user",
         },
      })
   } catch (error: any) {
      return res.status(500).json({ error: "Unable to create account." })
   }

   // Save JWT token for email verification
   const SEVEN_DAYS_IN_SECONDS = 604800
   const token = generateToken(account.email, SEVEN_DAYS_IN_SECONDS)
   try {
      await prisma.emailVerification.create({
         data: {
            token: token,
         },
      })
   } catch (error: any) {
      throw new Error(error)
   }

   // Send verification email
   await sendEmail(
      { email: "noreply@veovirginia.com", name: "VEO Virginia" },
      { email: account.email, name: account.name },
      "Email Verification",
      `<h3>Welcome to the Virginia Entrepreneurship Organization!</h3><br /><p>We're excited to have you join us, ${account.name}. Before you can continue, please verify your email by clicking on this link: <a href="https://veovirginia.com/verify/${token}" target="_blank">https://veovirginia.com/verify/${token}</a><br />Note: This link will expire in 7 days.</p>`
   )

   // Return creation status
   return res.status(201).json({
      success: true,
      message: "Created user.",
   })
}
