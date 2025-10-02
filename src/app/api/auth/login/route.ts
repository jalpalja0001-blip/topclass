import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 로그인 요청 시작...')
    
    const body = await request.json()
    console.log('📊 요청 데이터:', { email: body.email })
    
    const { email, password } = loginSchema.parse(body)
    console.log('✅ 데이터 검증 통과')

    // Supabase Auth로 로그인
    console.log('🔐 Supabase 로그인 시도...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('❌ Supabase 로그인 오류:', error.message)
      
      // 사용자 친화적인 오류 메시지 제공
      let userMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
      if (error.message.includes('Invalid login credentials')) {
        userMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
      } else if (error.message.includes('Email not confirmed')) {
        userMessage = '이메일 인증이 필요합니다. 이메일을 확인해주세요.'
      } else if (error.message.includes('Too many requests')) {
        userMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
      }
      
      return NextResponse.json(
        { success: false, error: userMessage },
        { status: 401 }
      )
    }

    console.log('✅ 로그인 성공!')
    console.log('📊 사용자 정보:', { 
      id: data.user?.id, 
      email: data.user?.email,
      email_confirmed: data.user?.email_confirmed_at 
    })

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name || data.user?.email,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: '잘못된 입력 데이터입니다.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
