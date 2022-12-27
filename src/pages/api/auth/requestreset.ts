import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../helpers/db"
import {
   validateEmail,
   validateEmailExists,
} from "../../../helpers/auth"

import generateToken from "../../../helpers/auth/generateToken"
import { sendEmail } from "../../../helpers/email"
import { ResetRequestBody } from "../../../types/auth"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) { 
    if (req.method !== 'POST') // Check request method
        return res.status(405).json({error: "Invalid HTTP method."})
    if (!req.body) // Check empty body
        return res.status(400).json({error: "Empty request body."})
    
    const resetRequest: ResetRequestBody = req.body

    /**
     * Validating our email
     * Note that we only return an error if the format is invalid
     * This is because we want a non-user email to still result in a "success" message
     * This is for the sake of security
     */
    const {email} = resetRequest
    const emailFormatError = validateEmail(email)
    const emailExistsError = await validateEmailExists(email)

    if (emailFormatError.length > 0) {
        let errors = {emails: emailFormatError}
        return res.status(400).json(errors)
    }

    // We should only be performing DB ops if the email exists
    if (emailExistsError.length == 0) {
        // Generate our token for verification
        const ONE_HOUR_IN_SECONDS = 3600
        const token = generateToken(email, ONE_HOUR_IN_SECONDS)
        console.log(token)
        try {
            // Store our reset password verification token
            await prisma.resetPasswordVerification.create({
                data: {token}
            })
            // Get the name of the current user
            let {name} = await prisma.user.findUnique({
                where: {email},
                select: {name: true}
            })
            
            // Send our email
            // TODO: Extract VEO email and name, extract template
            await sendEmail(
                { email: "noreply@virignia.edu", name: "VEO Virginia" },
                { email, name },
                "Reset Password",
                `${token}`
            )
        } catch (error: any) {
            // TODO: Some sort of logging
            return res.status(500).json({error: "Something went wrong."})
        }
    }

    // Return a "success" prompt
    return res.status(201).json({
        success: true,
        message: "If the email is correct, a passowrd link has been sent."
    })
}