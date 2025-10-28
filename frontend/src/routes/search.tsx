import { useState } from 'react'

import { searchShows } from '@/api/show'
import { followShow, unfollowShow } from '@/api/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import type { followShowType } from '@/types/show'

export const Route = createFileRoute('/search')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['shows', searchQuery],
    queryFn: () => searchShows(searchQuery),
    enabled: searchQuery.length >= 3,
  })

  const { mutate: followShowMutation, isPending: isFollowing } = useMutation({
    mutationFn: followShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shows', searchQuery] })
      queryClient.invalidateQueries({ queryKey: ['followedShows'] })
    },
  })

  const { mutate: unfollowShowMutation, isPending: isUnfollowing } =
    useMutation({
      mutationFn: unfollowShow,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shows', searchQuery] })
        queryClient.invalidateQueries({ queryKey: ['followedShows'] })
      },
    })

  const handleFollow = (showData: followShowType) => {
    followShowMutation(showData)
  }

  const handleUnfollow = (showId: number) => {
    unfollowShowMutation(showId)
  }

  return (
    <div>
      <h1>Search Shows</h1>
      <input
        type="text"
        placeholder="Enter show name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div>
        {isPending && searchQuery.length >= 3 && <p>Searching...</p>}
        {isError && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        {data && data.data.length === 0 && <p>No shows found</p>}
        {data && data.data.length > 0 && (
          <ul>
            {data.data.map((show) => (
              <li key={show.id}>
                <div>
                  {show.poster && (
                    <img
                      src={show.poster}
                      alt={show.name}
                      style={{ width: '50px', height: '75px' }}
                    />
                  )}
                  <span>
                    {show.name} ({show.country})
                  </span>
                </div>
                {show.followed ? (
                  <button
                    onClick={() => handleUnfollow(show.id)}
                    disabled={isUnfollowing}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleFollow({
                        apiId: show.id,
                        name: show.name,
                        poster: show.poster,
                        country: show.country,
                        premiered: show.premiered,
                      })
                    }
                    disabled={isFollowing}
                  >
                    Follow
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
