import { useState, useEffect } from 'react'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/app/providers/AuthProvider'
import { StrategyParameters } from '@/lib/backtest/types'

export interface SavedStrategy {
  id: string
  name: string
  description: string
  parameters: StrategyParameters
  performance_metrics: any
  is_public: boolean
  created_at: string
  updated_at: string
}

export function useStrategyVault() {
  const { user } = useAuth()
  const [strategies, setStrategies] = useState<SavedStrategy[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStrategies = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('saved_strategies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setStrategies(data || [])
    } catch (err: any) {
      console.error('Error fetching strategies:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStrategies()
  }, [user])

  const saveStrategy = async (strategy: Partial<SavedStrategy>) => {
    if (!user) throw new Error('Must be logged in to save strategies')
    setLoading(true)
    try {
      const { data, error: saveError } = await supabase
        .from('saved_strategies')
        .upsert({
          ...strategy,
          user_id: user.id,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (saveError) throw saveError
      await fetchStrategies()
      return data
    } catch (err: any) {
      console.error('Error saving strategy:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteStrategy = async (id: string) => {
    if (!user) throw new Error('Must be logged in to delete strategies')
    setLoading(true)
    try {
      const { error: deleteError } = await supabase
        .from('saved_strategies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) throw deleteError
      setStrategies(prev => prev.filter(s => s.id !== id))
    } catch (err: any) {
      console.error('Error deleting strategy:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    strategies,
    loading,
    error,
    saveStrategy,
    deleteStrategy,
    refresh: fetchStrategies
  }
}
