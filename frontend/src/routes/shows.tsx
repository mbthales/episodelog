import { getUserShows } from '@/api/user'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FollowedShowCard from '../components/FollowedShowCard';

export const Route = createFileRoute('/shows')({
  component: RouteComponent,
})

function RouteComponent() {
  const [pressedShowId, setPressedShowId] = useState<string | null>(null);
  const [activePressId, setActivePressId] = useState<string | null>(null);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['shows'],
    queryFn: () => getUserShows(),
  })

  return (
    <div>
      {isPending && <p>Carregando...</p>}
      {isError && <p style={{ color: 'red' }}>Erro: {error.message}</p>}
      <div className='flex gap-3 flex-wrap justify-center items-center'>
        {data &&
          data.data.map((show) => (
            <FollowedShowCard
              key={show.id} 
              show={show}
              isPressed={pressedShowId === show.id}
              isActive={activePressId === show.id}
              onPressStart={() => setActivePressId(show.id)}
              onPressEnd={() => setActivePressId(null)}
              onLongPress={() => {
                setPressedShowId(show.id);
              }}
              onUnfollow={() => setPressedShowId(null)}
            />
        ))}
      </div>
    </div>
  )
}