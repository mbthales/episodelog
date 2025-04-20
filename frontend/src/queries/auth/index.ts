import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:3000/',
})

export async function signin(data: {
  username: string
  password: string
}): Promise<unknown> {
  const res = await instance.post('/signin', data)

  return res.data.data
}

export async function signup(data: {
  username: string
  email: string
  password: string
}): Promise<unknown> {
  const res = await instance.post('/signup', data)

  return res.data.data
}
