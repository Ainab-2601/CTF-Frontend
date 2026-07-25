import React, { useState } from 'react'
import { useStore } from './store/useStore'
import { Lobby } from './pages/Lobby'
import { Arena } from './pages/Arena'
import { Admin } from './pages/Admin'

export const App: React.FC = () => {
  const currentTeamId = useStore((state) => state.currentTeamId)
  const [, forceUpdate] = useState({})

  // Admin route check
  if (window.location.pathname === '/admin') {
    return <Admin />
  }

  return currentTeamId ? (
    <Arena />
  ) : (
    <Lobby onAuthSuccess={() => forceUpdate({})} />
  )
}

export default App