'use client'

import { useCallback, useEffect, useState } from 'react'

const KEY = 'civics.process.v1'

/** Estado de la lista de documentos (marcados), persistido en el navegador. */
export function useChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setChecked(JSON.parse(raw))
    } catch {
      /* ignora */
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(KEY, JSON.stringify(checked))
    } catch {
      /* ignora */
    }
  }, [checked, loaded])

  const toggle = useCallback((id: string) => setChecked((c) => ({ ...c, [id]: !c[id] })), [])

  return { checked, toggle, loaded }
}
