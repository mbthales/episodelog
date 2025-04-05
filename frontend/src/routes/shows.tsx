import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getUserShows, removeUserShow } from '../queries/userShows'

export const Route = createFileRoute('/shows')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: userShows } = useQuery({
    queryKey: ['userShows'],
    queryFn: () => getUserShows(),
  })
  const removeShow = useMutation({
    mutationFn: (showId: number) => {
      return removeUserShow(showId)
    },
  })

  return (
    <div>
      {userShows && userShows.length > 0 && (
        <div>
          <h2>Liked Shows</h2>
          <ul>
            {userShows.map(({ name, showId }) => (
              <li key={showId}>
                {name}
                <button onClick={() => removeShow.mutate(showId)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
