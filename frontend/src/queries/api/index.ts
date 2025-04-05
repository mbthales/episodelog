import axios from 'axios'

import type { ApiShowResponse } from '../../types'

const instance = axios.create({
  baseURL: 'https://api.tvmaze.com/',
})

export async function getApiShowsBySimilarName(
  showName: string
): Promise<ApiShowResponse[]> {
  const res = await instance.get(`/search/shows?q=${showName}`)
  return res.data
}
