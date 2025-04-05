import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getApiShowsBySimilarName } from '../queries/api'
import { addUserShow } from '../queries/userShows'

import type { UserShow } from '../types'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [showName, setShowName] = useState('')
  const {
    data: shows,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['apiShows', showName],
    queryFn: () => getApiShowsBySimilarName(showName),
  })
  const addShow = useMutation({
    mutationFn: (show: UserShow) => addUserShow(show),
  })

  return (
    <>
      <label>
        Search
        <input onInput={(e) => setShowName(e.currentTarget.value)} />
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error fetching data</div>}
        {shows && (
          <ul>
            {shows.map(({ show }) => (
              <li key={show.id}>
                <h2>
                  {show.name} - {show.premiered}
                </h2>
                <button
                  onClick={() =>
                    addShow.mutate({ showId: show.id, name: show.name })
                  }
                >
                  Like
                </button>
              </li>
            ))}
          </ul>
        )}
      </label>
    </>
  )
}

export default Index
