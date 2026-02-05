import { useState, useCallback } from "react"

export function useForm<T>(initialState: T) {
  const [values, setValues] = useState<T>(initialState)

  const setValue = useCallback((key: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialState)
  }, [initialState])

  const toggleInArray = useCallback((key: keyof T, item: any) => {
    setValues(prev => {
      const currentArray = prev[key] as any[]
      const nextArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item]
      return { ...prev, [key]: nextArray }
    })
  }, [])

  return { values, setValue, toggleInArray, reset, setValues }
}