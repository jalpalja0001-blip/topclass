import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const progressSchema = z.object({
  watchTime: z.number().min(0),
  completed: z.boolean().optional(),
})

export async function PUT(
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

    const body = await request.json()
    const { watchTime, completed } = progressSchema.parse(body)

    // Get lesson and course info
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: {
        id: true,
        courseId: true,
        duration: true,
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: '강의를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // Get course progress
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: payload.userId,
          courseId: lesson.courseId,
        },
      },
    })

    if (!courseProgress) {
      return NextResponse.json(
        { success: false, error: '강의 진도를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // Determine if lesson is completed
    const isCompleted = completed ?? (watchTime >= lesson.duration * 0.9) // 90% watched = completed

    // Update lesson progress
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        courseProgressId_lessonId: {
          courseProgressId: courseProgress.id,
          lessonId: lesson.id,
        },
      },
      update: {
        watchTime,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        courseProgressId: courseProgress.id,
        lessonId: lesson.id,
        watchTime,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    })

    // Update course progress percentage
    const allLessonsProgress = await prisma.lessonProgress.findMany({
      where: {
        courseProgressId: courseProgress.id,
      },
    })

    const totalLessons = await prisma.lesson.count({
      where: {
        courseId: lesson.courseId,
        published: true,
      },
    })

    const completedLessons = allLessonsProgress.filter(p => p.completed).length
    const progressPercent = Math.round((completedLessons / totalLessons) * 100)
    const courseCompleted = progressPercent === 100

    await prisma.courseProgress.update({
      where: { id: courseProgress.id },
      data: {
        progressPercent,
        completedAt: courseCompleted ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        lessonProgress,
        courseProgressPercent: progressPercent,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: '잘못된 입력 데이터입니다.' },
        { status: 400 }
      )
    }

    console.error('Error updating lesson progress:', error)
    return NextResponse.json(
      { success: false, error: '진도 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
