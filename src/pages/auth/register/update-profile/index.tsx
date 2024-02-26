import { ChangeEvent, useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import cookie from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import { CreateUser } from '@/api/create-user'

import { ArrowRight } from 'phosphor-react'
import { toast } from 'sonner'

import { MultiStepForm } from '@/components/multi-step-form'

const storageUserSchema = z.object({
  authId: z.string(),
  avatarUrl: z.string().url(),
  email: z.string().email(),
  fullName: z.string(),
  username: z.string(),
})

type storageSchema = z.infer<typeof storageUserSchema>

const updateProfileSchema = z.object({
  bio: z.string().min(1, { message: 'Insira um texto para sua bio' }),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export function UpdateProfile() {
  const navigate = useNavigate()
  const [preview, setPreview] = useState<string | null>(null)

  useLayoutEffect(() => {
    const userOnStorage = localStorage.getItem('@user')
    if (!userOnStorage) {
      navigate('/', {
        replace: true
      })
      return null;
    }
  }, [])


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema)
  })

  async function handleSaveBio(data: UpdateProfileData) {
    const userOnStorage = localStorage.getItem('@user')
    if (userOnStorage) {
      const user: storageSchema = JSON.parse(userOnStorage!)
      const userData = {
        ...user,
        bio: data.bio,
      }
      localStorage.setItem('@user', JSON.stringify(userData))
      const { data: response } = await CreateUser({
        authId: user.authId,
        avatarUrl: user.avatarUrl,
        bio: data.bio,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
      })
      setValue('bio', '')
      cookie.set('@token', response.data.token)
      toast.success('Usuário criado com sucesso!', { action: { label: 'Fechar', onClick: () => console.log('Fechou') } })
      console.log(response.data)
      navigate('/home')
    }
  }

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return;
    }

    const previewURL = URL.createObjectURL(files[0])
    setPreview(previewURL)
    console.log(previewURL)
  }

  const userOnStorage = localStorage.getItem('@user')
  const user: storageSchema = JSON.parse(userOnStorage!)

  return (
    <main className="flex flex-col h-screen mx-auto mt-24 max-w-xl gap-2">
      <MultiStepForm
        title='Defina sua disponibilidade'
        description="Por último, uma breve descrição e uma foto de perfil."
        index={3}
      />

      <form
        onSubmit={handleSubmit(handleSaveBio)}
        className='flex flex-col max-w-[540px] border border-zinc-600 bg-zinc-800 p-6 rounded-md gap-4'
      >

        <div className='flex flex-col gap-2'>
          <label htmlFor="bio" className='font-normal text-[#E1E1E6]'>Foto de perfil</label>
          <div className='flex gap-4 items-center'>
            <img src={preview ? preview : user.avatarUrl} className='rounded-full w-16 h-16' />
            <label htmlFor="media" className="cursor-pointer text-sm text-[#00B37E] p-2 border-2 border-[#00B37E] rounded">
              Selecionar foto
            </label>

            {/* Input File for select avatar */}
            <input
              onChange={onFileSelected}
              name="avatarUrl"
              type="file"
              id="media"
              accept="image/*"
              className="invisible h-0 w-0"
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="bio" className='font-normal text-[#E1E1E6]'>Sobre você</label>
          <textarea
            id='bio'
            spellCheck={false}
            {...register('bio')}
            className='bg-zinc-900 px-4 py-3 h-32 resize-none rounded-md focus:outline-none text-normal'
          />
          <span className='font-normal text-sm text-[#A9A9B2] mb-4'>
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </span>

          {errors.bio && (
            <span className='font-medium text-xs text-[#f75a68]'>{errors.bio.message}</span>
          )}
        </div>


        <button
          disabled={isSubmitting}
          type='submit'
          className='flex items-center justify-center gap-2 font-medium text-sm bg-[#00875F] py-3 rounded-md disabled:bg-zinc-400 disabled:cursor-not-allowed'>
          Finalizar
          <ArrowRight className='w-6 h-6' />
        </button>
      </form>
    </main>
  )
}
