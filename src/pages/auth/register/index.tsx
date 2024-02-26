import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useNavigate } from 'react-router-dom'

import { ArrowRight } from 'phosphor-react'

import { MultiStepForm } from '@/components/multi-step-form'

const storageUserSchema = z.object({
  authId: z.string(),
  avatarUrl: z.string().url(),
  email: z.string().email(),
  fullName: z.string(),
})

type storageSchema = z.infer<typeof storageUserSchema>

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens.',
    })
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export function Register() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema)
  })

  useEffect(() => {
    const userOnStorage = localStorage.getItem('@user')

    if (userOnStorage) {
      const user: storageSchema = JSON.parse(userOnStorage!)
      setValue('name', user.fullName)
      return;
    }
  }, [setValue])

  function handleRegister(data: RegisterFormData) {
    const userOnStorage = localStorage.getItem('@user')
    if (userOnStorage) {
      const user: storageSchema = JSON.parse(userOnStorage!)
      const userData = {
        ...user,
        username: data.username.toLowerCase(),
        fullName: data.name,
      }
      localStorage.setItem('@user', JSON.stringify(userData))
      navigate('/update-profile')
    }
  }

  return (
    <main className="flex flex-col h-screen mx-auto mt-24 max-w-xl gap-2">
      <MultiStepForm
        title='Bem-Vindo ao Call Agenda!'
        description={`Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.`}
        index={0}
      />

      <form
        onSubmit={handleSubmit(handleRegister)}
        className='flex flex-col max-w-[540px] border border-zinc-600 bg-zinc-800 p-6 rounded-md gap-4'
      >

        <div className='flex flex-col gap-2'>
          <label htmlFor="username" className='font-normal text-[#E1E1E6]'>Nome de usuário</label>
          <input
            id='username'
            {...register('username')}
            className='bg-zinc-900 px-4 py-3 rounded-md focus:outline-none text-normal'
          />
          {errors.username && (
            <span className='font-medium text-xs text-[#f75a68]'>{errors.username.message}</span>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="fullName" className='font-normal text-[#E1E1E6]'>Nome Completo</label>
          <input id='fullName'
            {...register('name')}
            className='bg-zinc-900 px-4 py-3 rounded-md focus:outline-none text-normal'
          />
          {errors.name && (
            <span className='font-medium text-xs text-[#f75a68]'>{errors.name.message}</span>
          )}
        </div>

        <button type='submit' className='flex items-center justify-center gap-2 font-medium text-sm bg-[#00875F] py-3 rounded-md'>
          Próximo passo
          <ArrowRight className='w-6 h-6' />
        </button>
      </form>
    </main>
  )
}
