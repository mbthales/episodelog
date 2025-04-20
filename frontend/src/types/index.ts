export type ApiShowResponse = {
  show: {
    id: number
    name: string
    premiered: string
  }
}

export type ApiShowEpisodeResponse = {
  airstamp: string
  name: string
  season: number
  number: number
  _links: {
    show: {
      name: string
    }
  }
}

export type UserShow = {
  showId: number
  name: string
}

export type ErrorResponse = {
  response: {
    data: {
      details: string
    }
  }
}
