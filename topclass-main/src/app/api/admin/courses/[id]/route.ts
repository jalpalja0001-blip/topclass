import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const payload = await request.json();
  
  console.log('🔧 강의 수정 요청:', {
    courseId: id,
    video_url: payload.video_url,
    hasVideoUrl: !!payload.video_url
  });

  // courses 테이블 스키마에 맞는 필드만 남기고 전달
  const updateFields: any = {
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.instructor !== undefined && { instructor: payload.instructor }),
    ...(payload.category !== undefined && { category: payload.category }), // 카테고리명 직접 저장
    ...(payload.status !== undefined && { status: payload.status }),       // 상태 문자열 직접 저장
    ...(payload.price !== undefined && { price: payload.price }),
    ...(payload.original_price !== undefined && { original_price: payload.original_price }),
    ...(payload.thumbnail_url !== undefined && { thumbnail_url: payload.thumbnail_url }),
    ...(payload.detail_image_url !== undefined && { detail_image_url: payload.detail_image_url }),
    ...(payload.video_url !== undefined && { video_url: payload.video_url }), // video_url 필드 활성화 (URL 또는 임베드 코드)
    ...(payload.tags !== undefined && { tags: payload.tags }),
    ...(payload.duration !== undefined && { duration: payload.duration }),
    ...(payload.level !== undefined && { level: payload.level }),
    ...(payload.is_featured !== undefined && { is_featured: payload.is_featured }),
    ...(payload.published !== undefined && { published: payload.published }),
    updated_at: new Date().toISOString(),
  };

  // 기타 null/빈 값 처리
  if (payload.category_id === '' || payload.category_id === null || payload.category_id === undefined) {
    updateFields.category_id = null;
  }
  if (payload.tags === '' || payload.tags === null || payload.tags === undefined) {
    updateFields.tags = [];
  }

  const { error } = await supabase
    .from('courses')
    .update(updateFields)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    // 강의 삭제
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('강의 삭제 오류:', error);
      return NextResponse.json({ 
        success: false, 
        message: error.message || '강의 삭제에 실패했습니다.' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: '강의가 성공적으로 삭제되었습니다.' 
    });

  } catch (error: any) {
    console.error('강의 삭제 중 오류:', error);
    return NextResponse.json({ 
      success: false, 
      message: '강의 삭제 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}