import { supabase } from './supabase'

// 데이터베이스 연결 상태 확인
export async function checkDatabaseConnection() {
  try {
    // 1. 기본 연결 테스트
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('데이터베이스 연결 실패:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ 데이터베이스 연결 성공!')
    return { success: true, data }
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error)
    return { success: false, error: '연결 오류가 발생했습니다.' }
  }
}

// 테이블 존재 여부 확인
export async function checkTablesExist() {
  const tables = ['categories', 'courses', 'lessons', 'purchases', 'course_progress', 'lesson_progress']
  const results = {}
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      results[table] = {
        exists: !error,
        error: error?.message || null
      }
    } catch (error) {
      results[table] = {
        exists: false,
        error: error.message
      }
    }
  }
  
  return results
}

// 샘플 데이터 조회 테스트
export async function testSampleData() {
  try {
    // 카테고리 데이터 조회
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    if (categoriesError) {
      console.error('카테고리 조회 실패:', categoriesError.message)
      return { success: false, error: categoriesError.message }
    }
    
    // 강의 데이터 조회
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .limit(5)
    
    if (coursesError) {
      console.error('강의 조회 실패:', coursesError.message)
      return { success: false, error: coursesError.message }
    }
    
    console.log('✅ 샘플 데이터 조회 성공!')
    console.log('📊 카테고리 개수:', categories?.length || 0)
    console.log('📚 강의 개수:', courses?.length || 0)
    
    return { 
      success: true, 
      data: { 
        categories: categories?.length || 0, 
        courses: courses?.length || 0 
      } 
    }
  } catch (error) {
    console.error('샘플 데이터 조회 오류:', error)
    return { success: false, error: '데이터 조회 중 오류가 발생했습니다.' }
  }
}

// 전체 데이터베이스 상태 확인
export async function getDatabaseStatus() {
  console.log('🔍 데이터베이스 상태 확인 시작...')
  
  try {
    // 1. 연결 테스트 (더 안전한 방식)
    const connectionTest = await checkDatabaseConnection()
    if (!connectionTest.success) {
      // 1295 오류나 테이블 없음 오류인 경우 특별 처리
      if (connectionTest.error && (
        connectionTest.error.includes('1295') || 
        connectionTest.error.includes('Could not find the table') ||
        connectionTest.error.includes('schema cache')
      )) {
        console.warn('⚠️ 데이터베이스 테이블 없음 감지. 연결 안됨으로 설정합니다.')
        return {
          status: 'warning',
          message: '데이터베이스 테이블 없음',
          details: 'Supabase 데이터베이스에 필요한 테이블이 없습니다.',
          isConnected: false
        }
      }
      
      return {
        status: 'error',
        message: '데이터베이스 연결 실패',
        details: connectionTest.error,
        isConnected: false
      }
    }
  
  // 2. 테이블 존재 확인
  const tableStatus = await checkTablesExist()
  const missingTables = Object.entries(tableStatus)
    .filter(([_, status]) => !status.exists)
    .map(([table, _]) => table)
  
  if (missingTables.length > 0) {
    return {
      status: 'warning',
      message: '일부 테이블이 존재하지 않습니다',
      details: `누락된 테이블: ${missingTables.join(', ')}`,
      missingTables
    }
  }
  
  // 3. 샘플 데이터 테스트
  const dataTest = await testSampleData()
  if (!dataTest.success) {
    return {
      status: 'warning',
      message: '데이터 조회에 문제가 있습니다',
      details: dataTest.error
    }
  }
  
    return {
      status: 'success',
      message: '데이터베이스가 정상적으로 작동합니다',
      details: dataTest.data
    }
  } catch (error) {
    console.error('데이터베이스 상태 확인 중 오류:', error)
    
    // 1295 오류인 경우 특별 처리
    if (error instanceof Error && error.message.includes('1295')) {
      console.warn('⚠️ MySQL 1295 오류로 인해 더미 데이터 모드로 전환합니다.')
      return {
        status: 'warning',
        message: 'MySQL 1295 오류 - 더미 데이터 모드',
        details: 'Supabase 데이터베이스 연결에 문제가 있습니다. 더미 데이터를 사용합니다.',
        isConnected: false
      }
    }
    
    return {
      status: 'error',
      message: '데이터베이스 상태 확인 실패',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }
  }
}
