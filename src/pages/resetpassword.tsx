import { GetServerSidePropsContext } from "next"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import cn from "classnames"
import AuthLayout from "../components/layouts/AuthLayout"
import Input from "../components/Input"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import Link from "next/link"
import axios from "axios"

type Inputs = {
   email: string
}

const schema = yup.object().shape({
   email: yup
      .string()
      .email("Invalid email")
      .matches(/@virginia.edu/i, "Must be a UVA email")
      .required("Email required"),
})

export default function Login() {
   const {
      control,
      handleSubmit,
      formState: { errors, isValid },
      reset,
   } = useForm<Inputs>({
      resolver: yupResolver(schema),
      defaultValues: {
         email: "",
      },
      mode: "onChange",
   })
   const submitHandler = async (values: any) => {
      // Handle email submission to server
      const { data } = await axios({
         method: "post",
         url: "/api/auth/requestreset",
         data: values,
      })
      // TODO: Display response
   }

   return (
      <AuthLayout>
         <div className="max-w-sm w-full mx-auto px-4 pt-24">
            <div className="text-center">
               <h1 className="text-3xl font-semibold text-zinc-50 mx-auto">
                  Reset Password
               </h1>
               <p className="text-base pt-2 text-noir-300">
                  Forgot your password?
               </p>
            </div>
            <form className="w-full" onSubmit={handleSubmit(submitHandler)}>
               <div className="w-full space-y-4 pt-10 pb-8">
                  <Controller
                     name="email"
                     control={control}
                     render={({ field: { value, onChange } }) => (
                        <Input
                           label="Email"
                           placeholder="johndoe@virginia.edu"
                           type="text"
                           required
                           value={value}
                           onChange={onChange}
                           error={errors.email}
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
                  <span>Send Link</span>
               </button>
               <div className="flex justify-center items-center pt-4 space-x-2">
                  <p className="text-noir-400">Don&apos;t have an account?</p>
                  <p className="cursor-pointer text-blue-500">
                     <Link href="/signup" passHref>
                        Sign up
                     </Link>
                  </p>
               </div>
            </form>
         </div>
      </AuthLayout>
   )
}
