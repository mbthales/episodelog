import axios from 'axios'
import { UserShow } from '../../types'

const instance = axios.create({
  baseURL: 'http://127.0.0.1:3000/',
})

export async function getUserShows(): Promise<UserShow[]> {
  const res = await instance.get('/userShows')
  return res.data.data
}

export async function addUserShow(show: UserShow): Promise<UserShow> {
  return await instance.post('/userShows', show)
}

export async function removeUserShow(id: number): Promise<void> {
  return await instance.delete(`/userShows/${id}`)
}
