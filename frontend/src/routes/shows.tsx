import { getUserShows } from '@/api/user'
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/shows')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = useAuthStore.getState()
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['shows'],
    queryFn: () => getUserShows(userId!),
  })

  return (
    <div>
      <p>teste</p>
      {isPending && <p>Carregando...</p>}
      {isError && <p style={{ color: 'red' }}>Erro: {error.message}</p>}
      {data &&
        data.data.map((show) => (
          <div key={show.id}>
            <h2>{show.name}</h2>
            <img src={show.poster || ''} alt={show.name} />
          </div>
        ))}
    </div>
  )
}
