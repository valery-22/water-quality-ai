// hooks/useSync.ts
import { useEffect } from 'react'
import { getDB } from '../lib/idb'
import { api } from '../lib/api'


export function useSyncOffline() {
  useEffect(() => {
    const sync = async () => {
      const db = await getDB()
      const tx = db.transaction('queued-readings', 'readwrite')
      const store = tx.objectStore('queued-readings')
      const all = await store.getAll()

      for (const item of all) {
        try {
          await api.post('/readings', item)
          await store.delete(item.id)
        } catch (e) {
          console.error('Retry failed', e)
        }
      }
    }

    window.addEventListener('online', sync)
    return () => window.removeEventListener('online', sync)
  }, [])
}
