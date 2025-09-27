import { useEffect } from 'react'

import { loginUser, refreshAccessToken } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const {
    mutate: signInMutation,
    isPending,
    isError,
    data,
    error,
  } = useMutation({
    mutationFn: loginUser,
  })

  const updateAccessToken = useAuthStore((state) => state.updateAccessToken)

  const handleLoginClick = () => {
    signInMutation({ username: 'testando', password: 'testando' })
  }

  useEffect(() => {
    if (data) {
      updateAccessToken(data.accessToken)
    }
  }, [data, updateAccessToken])

  return (
    <>
      <h1 className="text-9xl">Episodelog</h1>

      <button onClick={handleLoginClick}>
        {isPending ? 'Entrando...' : 'Clique para Entrar'}
      </button>

      <button onClick={refreshAccessToken}>Refresh</button>

      {isError && <p style={{ color: 'red' }}>Erro: {error.message}</p>}
      {data && (
        <p style={{ color: 'green' }}>Sucesso! Dados: {JSON.stringify(data)}</p>
      )}
    </>
  )
}
