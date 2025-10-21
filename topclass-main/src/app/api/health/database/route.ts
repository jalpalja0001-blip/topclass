import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseStatus } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 데이터베이스 상태 확인 요청...')
    
    const status = await getDatabaseStatus()
    
    return NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('데이터베이스 상태 확인 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '데이터베이스 상태 확인 중 오류가 발생했습니다.',
        data: {
          status: 'error',
          message: '상태 확인 실패',
          details: error instanceof Error ? error.message : '알 수 없는 오류'
        }
      },
      { status: 500 }
    )
  }
}
