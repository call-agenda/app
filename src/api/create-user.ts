import { api } from "@/lib/axios"

export interface CreateUserRequest {
  authId: string
  avatarUrl: string
  bio: string
  email: string
  fullName: string
  username: string
}

export async function CreateUser({ authId, avatarUrl, bio, email, fullName, username }: CreateUserRequest) {
  const data = await api.post('/user', { authId, avatarUrl, bio, email, fullName, username })
  return { data };
}