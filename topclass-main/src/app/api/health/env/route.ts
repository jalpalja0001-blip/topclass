import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 환경 변수 상태 확인...')
    
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const nodeEnv = process.env.NODE_ENV
    
    const envStatus = {
      supabaseUrl: {
        exists: !!supabaseUrl,
        value: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'Not set',
        status: supabaseUrl ? '✅ 설정됨' : '❌ 설정되지 않음'
      },
      supabaseKey: {
        exists: !!supabaseKey,
        value: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'Not set',
        status: supabaseKey ? '✅ 설정됨' : '❌ 설정되지 않음'
      },
      nodeEnv: {
        exists: !!nodeEnv,
        value: nodeEnv || 'Not set',
        status: nodeEnv ? '✅ 설정됨' : '❌ 설정되지 않음'
      }
    }
    
    // 전체 상태 계산
    const allSet = supabaseUrl && supabaseKey && nodeEnv
    const overallStatus = allSet ? 'success' : 'warning'
    const message = allSet 
      ? '모든 환경 변수가 올바르게 설정되었습니다.' 
      : '일부 환경 변수가 설정되지 않았습니다.'
    
    return NextResponse.json({
      success: true,
      data: {
        status: overallStatus,
        message,
        environment: envStatus,
        recommendations: allSet ? [] : [
          '.env.local 파일을 생성하세요',
          'NEXT_PUBLIC_SUPABASE_URL을 설정하세요',
          'NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요',
          '개발 서버를 재시작하세요'
        ]
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('환경 변수 확인 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '환경 변수 확인 중 오류가 발생했습니다.',
        data: {
          status: 'error',
          message: '환경 변수 확인 실패',
          details: error instanceof Error ? error.message : '알 수 없는 오류'
        }
      },
      { status: 500 }
    )
  }
}
