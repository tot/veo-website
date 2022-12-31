import { useState } from "react"
import cn from "classnames"
import { FieldError } from "react-hook-form"
import { BiShow, BiHide } from "react-icons/bi"

interface InputProps {
   label: string
   placeholder: string
   type: "text" | "number" | "password"
   required?: boolean
   disabled?: boolean
   value: string
   error?: FieldError | undefined
   onChange: (event: any) => void
}

export default function Input({
   label,
   placeholder,
   type,
   required,
   disabled,
   value,
   error,
   onChange,
}: InputProps) {
   const [val, setVal] = useState(value)
   const [visPwd, setVisPwd] = useState(false)
   const [pwd, setPwd] = useState("")

   return (
      <div className="text-left">
         <p className="text-sm text-noir-300 font-regular pb-2">{label}</p>
         <div style = {{display: "flex", flexDirection: "row"}}>
         <input
            className={cn(
               "border-neo-gray-800 bg-noir-900 outline-none text-neutral-400 placeholder:text-noir-500 w-full p-2 rounded focus:outline-blue-500 outline-offset-0 border focus:border-light-background-border transition-all duration-125 ease-in-out",
               {
                  "border-red-500": error,
               }
            )}
            placeholder={placeholder}
            type={visPwd ? "text" : "password"}
            value={val}
            required={required}
            disabled={disabled}
            onChange={(event: any) => {
               setPwd(event.target?.value)
               const target = event.target as HTMLInputElement
               if (target) {
                  setVal(target.value)
                  onChange(event.target?.value)
               }
            }}
         />
         { type === "password" && 
            <button
               style = {{marginLeft: "-30px"}}
               onClick = {() => setVisPwd(!visPwd)}
               className = "text-white"
            >
               {visPwd ? <BiHide /> : <BiShow />}
            </button>
         }
         </div>
         <p className="mt-1 text-red-500 text-sm">{error?.message}</p>
      </div>
   )
}

Input.defaultProps = {
   required: false,
   disabled: false,
   error: undefined,
}
