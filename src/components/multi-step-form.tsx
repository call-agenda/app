import { Register } from "@/pages/auth/register"
import { UpdateProfile } from "@/pages/auth/register/update-profile"

interface MultiStepFormProps {
  title: string
  description: string
  index: number
}

export function MultiStepForm(props: MultiStepFormProps) {
  const steps = [
    <Register />,
    <></>,
    <></>,
    <UpdateProfile />
  ]

  return (
    <>
      <h1 className='font-bold text-2xl leading-tight'>{props.title}</h1>
      <p className='font-normal text-base text-[#A9A9B2] mb-4'>
        {props.description}
      </p>

      <div className='flex flex-col gap-2 mb-4'>
        <span className="font-normal text-xs text-zinc-400">Passo {props.index + 1} de {steps.length}</span>
        <div className='flex gap-2'>
          {steps.map((_, index) => (
            <div key={index} className={`w-28 h-1 rounded-sm ${index == props.index ? 'bg-[#E1E1E6]' : 'bg-[#323238]'}`} />
          ))}
        </div>
      </div>
    </>
  )
}