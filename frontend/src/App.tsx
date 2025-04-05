import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getApiShowsBySimilarName } from './queries/api'
import { addUserShow, getUserShows, removeUserShow } from './queries/userShows'

import { UserShow } from './types'

function App() {
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
    </>
  )
}

export default App
