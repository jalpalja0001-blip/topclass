import { supabase } from './supabase'

export async function createUser(email: string, password: string, name?: string) {
  try {
    // Supabase Auth를 사용한 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || null,
        },
      },
    })

    if (error) {
      console.error('Supabase signup error:', error)
      throw new Error(error.message)
    }

    return data.user
  } catch (error) {
    console.error('Create user error:', error)
    throw error
  }
}

export async function authenticateUser(email: string, password: string) {
  try {
    // Supabase Auth를 사용한 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Supabase signin error:', error)
      return null
    }

    return data.user
  } catch (error) {
    console.error('Authenticate user error:', error)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Get current user error:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Sign out error:', error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}
