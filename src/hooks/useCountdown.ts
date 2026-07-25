import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

export const useCountdown = () => {
  const endTime = useStore((state) => state.endTime)
  const round = useStore((state) => state.round)

  const calculateRemaining = () => {
    const remainingMs = endTime - Date.now()
    return Math.max(0, Math.floor(remainingMs / 1000))
  }

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateRemaining())

  useEffect(() => {
    // endTime change hote hi (round change / refresh) turant recalculate karo
    setTimeRemaining(calculateRemaining())

    const interval = setInterval(() => {
      setTimeRemaining(calculateRemaining())
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  const formatTime = () => {
    const h = Math.floor(timeRemaining / 3600)
    const m = Math.floor((timeRemaining % 3600) / 60)
    const s = timeRemaining % 60
    return [
      h > 0 ? String(h).padStart(2, '0') : null,
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0'),
    ].filter(Boolean).join(':')
  }

  return { timeRemaining, formatTime, round }
}