import { useLongPress } from 'use-long-press'

import { unfollowShow } from '@/api/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type FollowedShowCardProps = {
  show: {
    id: string
    name: string
    poster: string | null
    api_id: number
  }
  isPressed: boolean
  isActive: boolean
  onLongPress: () => void
  onPressStart: () => void
  onPressEnd: () => void
  onUnfollow: () => void
}

export default function FollowedShowCard({
  show,
  isPressed,
  isActive,
  onLongPress,
  onPressStart,
  onPressEnd,
  onUnfollow,
}: FollowedShowCardProps) {
  const bind = useLongPress(
    () => {
      onLongPress()
    },
    {
      onStart: () => onPressStart(),
      onFinish: () => onPressEnd(),
      onCancel: () => onPressEnd(),
      threshold: 300,
    }
  )
  const queryClient = useQueryClient()

  const { mutate: unfollowShowMutation, isPending: isUnfollowing } =
    useMutation({
      mutationFn: unfollowShow,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shows'] })
      },
    })

  const handleUnfollow = (showId: number) => {
    unfollowShowMutation(showId)
    onUnfollow()
  }

  return (
    <div className="max-w-[160px] relative">
      <img
        src={show.poster || ''}
        alt={show.name}
        {...bind()}
        className={`transition-transform duration-200 ${isActive ? 'scale-90' : 'scale-100'}`}
      />
      <button
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 px-4 py-2 rounded active:duration-75
        ${isPressed ? 'block' : 'hidden'}`}
        disabled={isUnfollowing}
        onClick={() => handleUnfollow(show.api_id)}
      >
        {isUnfollowing ? 'Unfollowing...' : 'Unfollow'}
      </button>
    </div>
  )
}
