import { useState, useEffect } from 'react'
import { getUser, createUser, updateUser } from '../db/database'

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser().then((u) => {
      setUser(u || null)
      setLoading(false)
    })
  }, [])

  async function register(name, preferredUnit) {
    const u = await createUser(name, preferredUnit)
    setUser(u)
    return u
  }

  async function update(changes) {
    if (!user) return
    const u = await updateUser(user.id, changes)
    setUser(u)
    return u
  }

  return { user, loading, register, update }
}
