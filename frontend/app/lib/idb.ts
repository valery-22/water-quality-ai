// lib/idb.ts
import { openDB } from 'idb'

export const getDB = () => openDB('offline-db', 1, {
  upgrade(db) {
    db.createObjectStore('queued-readings', { keyPath: 'id' })
  }
})
