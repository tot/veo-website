import { GetServerSidePropsContext } from "next"
import { Fragment } from "react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import cn from "classnames"
import AuthLayout from "../../components/layouts/AuthLayout"
import Input from "../../components/Input"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { getJWTPayload } from "../../helpers/auth/jwtUtils"

type Inputs = {
   password: string
}

const schema = yup.object().shape({
   password: yup
      .string()
      .min(8, "Must be at least 8 characters")
      .max(32, "Must not exceed 32 characters")
      .matches(/(?=.*[a-z])/, "Must contain a lowercase letter")
      .matches(/(?=.*[A-Z])/, "Must contain an uppercase letter")
      .matches(/(?=.*[0-9])/, "Must contain a number")
      .matches(/(?=.*[-+_!@#$%^&*., ?])/, "Must contain a special character")
      .required("Password required"),
})

interface ResetPasswordProps {
   token: string
   error?: string
   email?: string
}

function ResetPasswordForm({ token, email }: ResetPasswordProps) {
   const {
      control,
      handleSubmit,
      formState: { errors, isValid },
      reset,
   } = useForm<Inputs>({
      resolver: yupResolver(schema),
      defaultValues: {
         password: "",
      },
      mode: "onChange",
   })

   const submitHandler = async (values: any) => {
      // TODO: Send request to API, make endpoint
   }

   return (
      <Fragment>
         <div className="text-center">
            <h1 className="text-3xl font-semibold text-zinc-50 mx-auto">
               Reset Password
            </h1>
            <p className="text-base pt-2 text-noir-300">
               Enter your new password
            </p>
         </div>
         <form className="w-full" onSubmit={handleSubmit(submitHandler)}>
            <div className="w-full space-y-4 pt-10 pb-8">
               <Controller
                  name="password"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                     <Input
                        label="Password"
                        placeholder="********"
                        type="password"
                        required
                        value={value}
                        onChange={onChange}
                        error={errors.password}
                     />
                  )}
               />
            </div>
            <button
               type="submit"
               disabled={!isValid}
               className={cn(
                  "transition-colors duration-125 text-base w-full px-2 py-2 border rounded flex justify-center items-center space-x-2",
                  {
                     "bg-zinc-50 text-neutral-900 border-zinc-50": isValid,
                     "bg-noir-800/30 text-noir-600 border-noir-800 cursor-not-allowed":
                        !isValid,
                  }
               )}
            >
               <span>Reset Password</span>
            </button>
         </form>
      </Fragment>
   )
}

export default function ResetPassword({
   token,
   email,
   error,
}: ResetPasswordProps) {
   return (
      <AuthLayout>
         <div className="max-w-sm w-full mx-auto px-4 pt-24 text-noir-300">
            { !error ? (
               <p className="text-center">Invalid/Expired Link</p>
            ) : (
               <ResetPasswordForm token={token} email={email}/>
            )}
         </div>
      </AuthLayout>
   )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
   const { query: token } = context

   try {
      // Fetch the email of the JWT payload
      // If invalid, this function call throws an error
      const { email } = getJWTPayload(`${token}`)

      // Make sure the token exists
      const results = await prisma.resetPasswordVerification.findUnique({
         where: { token },
      })

      // Handle failure/success
      if (!results) 
         return { props: { error: "Token does not exist." } }
      else 
         return { props: { token, email } }
   } catch (error) {
      return { props: { error: "Invalid Token." } }
   }
}
