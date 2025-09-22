import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ebookId = params.id

    // 실제로는 데이터베이스에서 전자책 파일 정보를 가져와야 합니다
    // 여기서는 시뮬레이션용 더미 파일을 반환합니다
    
    const ebookData = {
      id: ebookId,
      title: '전자책 파일',
      content: '이것은 전자책의 내용입니다. 실제로는 PDF나 EPUB 파일이 제공됩니다.',
      type: 'application/pdf'
    }

    // 실제 파일이 있다면 파일 스트림을 반환해야 합니다
    // const fileBuffer = await fs.readFile(`./ebooks/${ebookId}.pdf`)
    
    return new NextResponse(JSON.stringify({
      success: true,
      message: '다운로드가 완료되었습니다.',
      data: ebookData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Ebook download error:', error)
    return NextResponse.json(
      { success: false, error: '다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
