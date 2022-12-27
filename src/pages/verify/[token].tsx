import { GetServerSidePropsContext } from "next"
import AuthLayout from "../../components/layouts/AuthLayout"
import { getJWTPayload } from "../../helpers/auth/jwtUtils"

interface VerifyEmailProps {
   token: string
   error?: String
}

export default function VerifyEmail({ token, error }: VerifyEmailProps) {
   return (
      <AuthLayout>
         <div className="max-w-sm w-full mx-auto px-4 pt-24 text-center text-noir-300">
            {error ? (
               <p className="">
                  Unable to verify account email at the moment. Please try again
                  later.
               </p>
            ) : (
               <p className="">Email successfully verified!</p>
            )}
         </div>
      </AuthLayout>
   )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
   const { query: token } = context

   try {
      // Verify and extract email from token
      const { email } = getJWTPayload(`${token}`)

      // Make sure the token exists
      const results = await prisma.emailVerification.findUnique({
         where: { token },
      })

      // Token not in verification status
      if (!results) return { props: { token, error: "Token does not exist." } }

      // Confirm user as verified
      await prisma.user.update({
         where: { email },
         data: { emailVerified: true },
      })

      // Delete user from verification list
      await prisma.emailVerification.delete({
         where: { token },
      })
   } catch (error) {
      // Uh oh - something happened
      return {
         props: { token, error: "Unable to process request at the moment." },
      }
   }
}
