import { createFileRoute } from '@tanstack/react-router'
import { getApiShowEpisodesById } from '../queries/api'
import { getUserShows } from '../queries/userShows'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/episodes')({
  component: RouteComponent,
})

function formatDate(isoDate: string) {
  const date = new Date(isoDate)
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
  const day = ('0' + date.getUTCDate()).slice(-2)
  const year = date.getUTCFullYear()
  return `${month}/${day}/${year}`
}

function formatSeasonEpisode(season: number, episode: number) {
  return `S${season.toString().padStart(2, '0')}E${episode.toString().padStart(2, '0')}`
}

function RouteComponent() {
  const { data: userShows } = useQuery({
    queryKey: ['userShows'],
    queryFn: () => getUserShows(),
  })
  const { data: episodes, isLoading: episodesLoading } = useQuery({
    queryKey: ['episodes'],
    queryFn: async () => {
      if (!userShows) return []
      const episodesByShow = await Promise.all(
        userShows.map((show) => getApiShowEpisodesById(show.showId))
      )
      return episodesByShow.flat()
    },
    enabled: !!userShows,
  })

  const checkEpisodeDate = (episodeAirstamp: string) => {
    const episodeDate = new Date(episodeAirstamp)
    const currentDate = new Date()
    return episodeDate.getTime() > currentDate.getTime()
  }

  return (
    <div>
      <h1>Episodes</h1>
      {episodesLoading && <div>Loading...</div>}
      {episodes && episodes.length === 0 && <div>No episodes found</div>}
      {episodes && episodes.length > 0 && (
        <ul>
          {episodes
            .filter((episode) => checkEpisodeDate(episode.airstamp))
            .map((episode, index) => (
              <li key={index}>
                <p>{formatDate(episode.airstamp)}</p>
                <h2>
                  {episode._links.show.name} - {episode.name} -{' '}
                  {formatSeasonEpisode(episode.season, episode.number)}
                </h2>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
