import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const lesson = await prisma.lesson.findUnique({
      where: {
        id,
        published: true,
      },
      include: {
        course: {
          include: {
            category: true,
            lessons: {
              where: {
                published: true,
              },
              orderBy: {
                order: 'asc',
              },
              select: {
                id: true,
                title: true,
                order: true,
                duration: true,
              },
            },
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: '강의를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // Check if user has purchased the course
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: payload.userId,
          courseId: lesson.courseId,
        },
        status: 'completed',
      },
    })

    if (!purchase) {
      return NextResponse.json(
        { success: false, error: '강의를 구매해야 시청할 수 있습니다.' },
        { status: 403 }
      )
    }

    // Get or create lesson progress
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: payload.userId,
          courseId: lesson.courseId,
        },
      },
    })

    let lessonProgress = null
    if (courseProgress) {
      lessonProgress = await prisma.lessonProgress.findUnique({
        where: {
          courseProgressId_lessonId: {
            courseProgressId: courseProgress.id,
            lessonId: lesson.id,
          },
        },
      })

      if (!lessonProgress) {
        lessonProgress = await prisma.lessonProgress.create({
          data: {
            courseProgressId: courseProgress.id,
            lessonId: lesson.id,
            watchTime: 0,
            completed: false,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        lesson,
        progress: lessonProgress,
      },
    })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { success: false, error: '강의 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
