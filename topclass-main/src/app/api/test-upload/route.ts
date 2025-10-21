import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('🧪 테스트 API 호출됨!')
    
    const formData = await request.formData()
    console.log('📝 FormData 키들:', Array.from(formData.keys()))
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    
    console.log('📋 받은 데이터:', { title, description })
    
    return NextResponse.json({
      success: true,
      message: '테스트 성공!',
      data: { title, description }
    })
    
  } catch (error) {
    console.error('❌ 테스트 API 오류:', error)
    return NextResponse.json({
      success: false,
      error: '테스트 실패'
    }, { status: 500 })
  }
}
