// import { GoogleLogo } from 'phosphor-react'
import previewImage from '@/assets/preview.svg'

import { useNavigate } from 'react-router-dom'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'

import { jwtDecode } from "jwt-decode";
import { z } from 'zod'

const jwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  picture: z.string().url(),
  name: z.string(),
})

type jwtPayload = z.infer<typeof jwtPayloadSchema>

export function Auth() {

  const navigate = useNavigate()

  async function handleLoginWithGoogle(response: CredentialResponse) {
    console.log(response.credential)
    const decoded: jwtPayload = jwtDecode(response.credential!)
    const userOnStorage = localStorage.getItem('@user')

    if (userOnStorage) {
      localStorage.removeItem('@user')
    }

    const user = {
      authId: decoded.sub,
      avatarUrl: decoded.picture,
      email: decoded.email,
      fullName: decoded.name,
    }

    localStorage.setItem('@user', JSON.stringify(user))
    navigate(`/register`)
  }

  return (
    <main className="grid grid-cols-2 h-screen mx-auto items-center justify-center gap-5">
      <div className="max-w-[480px] px-0 py-3 flex flex-col mx-auto gap-4">
        <h1 className="font-extrabold text-4xl">Agendamento <br /> descomplicado</h1>
        <p className="font-normal text-xl text-[#A9A9B2]">Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.</p>

        {/* <button
          type='submit'
          onClick={() => handleLoginWithGoogle()}
          className='flex bg-red-500 px-6 py-3 gap-2 items-center justify-center font-medium text-sm rounded max-w-[240px]'>
          <GoogleLogo className='w-6 h-6' />
          Criar conta com Google
        </button> */}
        <GoogleLogin
          onSuccess={handleLoginWithGoogle}
        />
      </div>

      <img
        className=''
        src={previewImage}
        alt="Preview da aplicação Call"
        width={827}
        height={442}
      />
    </main>
  )
}