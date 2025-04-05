import axios from 'axios'

import type { ApiShowResponse, ApiShowEpisodeResponse } from '../../types'

const instance = axios.create({
  baseURL: 'https://api.tvmaze.com/',
})

export async function getApiShowsBySimilarName(
  showName: string
): Promise<ApiShowResponse[]> {
  const res = await instance.get(`/search/shows?q=${showName}`)
  return res.data
}

export async function getApiShowEpisodesById(
  id: number
): Promise<ApiShowEpisodeResponse> {
  const res = await instance.get(`/shows/${id}/episodes`)
  return res.data
}
