import { useEffect, useState } from 'react'

import { loginUser, refreshAccessToken } from '@/api/auth'
import { ModalLoginRegister } from '@/components/ModalLoginRegister'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate()
  const [modalState, setModalState] = useState(false)
  const {
    mutate: signInMutation,
    isPending,
    isError,
    data,
    error,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      console.log('Login successful!')
      navigate({ to: '/shows' })
    },
  })

  const updateAccessToken = useAuthStore((state) => state.updateAccessToken)
  const updateUsername = useAuthStore((state) => state.updateUsername)
  const updateUserId = useAuthStore((state) => state.updateUserId)

  const handleLoginClick = () => {
    // signInMutation({ username: 'testando', password: 'testando' })
    setModalState(true)
  }

  useEffect(() => {
    if (data) {
      updateAccessToken(data.accessToken)
      updateUsername(data.username)
      updateUserId(data.id)
    }
  }, [data, updateAccessToken, updateUsername, updateUserId])

  return (
    <>
      <h1 className="text-9xl font-title font-semibold">SERLY</h1>

      <button onClick={handleLoginClick}>
        {isPending ? 'Entrando...' : 'Clique para Entrar'}
      </button>

      <button onClick={refreshAccessToken}>Refresh</button>

      {modalState && <ModalLoginRegister />}

      {isError && <p style={{ color: 'red' }}>Erro: {error.message}</p>}
      {data && (
        <p style={{ color: 'green' }}>Sucesso! Dados: {JSON.stringify(data)}</p>
      )}
    </>
  )
}
