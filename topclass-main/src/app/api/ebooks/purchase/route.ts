import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { ebookId, action } = body

    if (!ebookId || !action) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 여기서는 실제 결제 처리를 하지 않고 시뮬레이션만 합니다
    if (action === 'download') {
      // 무료 다운로드 처리
      return NextResponse.json({
        success: true,
        message: '다운로드가 시작됩니다.',
        downloadUrl: `/api/ebooks/download/${ebookId}`
      })
    } else if (action === 'purchase') {
      // 유료 구매 처리 (실제로는 결제 시스템 연동 필요)
      return NextResponse.json({
        success: true,
        message: '구매가 완료되었습니다.',
        downloadUrl: `/api/ebooks/download/${ebookId}`
      })
    }

    return NextResponse.json(
      { success: false, error: '잘못된 요청입니다.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Ebook purchase error:', error)
    return NextResponse.json(
      { success: false, error: '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
