import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId, sessionUser = null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found! Let's insert a default profile manually
          const defaultProfile = {
            id: userId,
            full_name: sessionUser?.user_metadata?.full_name || 'User',
            email: sessionUser?.email || '',
            role: sessionUser?.user_metadata?.role || 'student'
          }
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile)
            .select()
            .single()
          
          if (insertError) {
            console.error('Failed to auto-create profile in DB:', insertError)
            // If database insert fails, return the fallback object in memory to prevent app lock
            return defaultProfile
          }
          return newProfile
        }
        console.error('Error fetching profile:', error)
        return null
      }
      return data
    } catch (err) {
      console.error('Fetch profile catch:', err)
      return null
    }
  }

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        const prof = await fetchProfile(session.user.id, session.user)
        setProfile(prof)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    // 2. Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true)
      if (session?.user) {
        setUser(session.user)
        const prof = await fetchProfile(session.user.id, session.user)
        setProfile(prof)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, fullName, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role || 'student',
        },
      },
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
