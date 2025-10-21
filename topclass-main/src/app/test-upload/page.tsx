'use client'

import { useState } from 'react'

export default function TestUploadPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTest = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🧪 테스트 시작!')
      
      const formData = new FormData()
      formData.append('title', '테스트 강의')
      formData.append('description', '테스트 설명')
      
      console.log('📤 FormData 전송 중...')
      
      const response = await fetch('/api/test-upload', {
        method: 'POST',
        body: formData
      })
      
      console.log('📡 응답 상태:', response.status)
      
      const data = await response.json()
      console.log('📦 응답 데이터:', data)
      
      setResult(data)
      
    } catch (error) {
      console.error('❌ 테스트 오류:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 업로드 테스트</h1>
      
      <div className="space-y-4">
        <button
          onClick={handleTest}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '테스트 중...' : '🧪 테스트 실행'}
        </button>
        
        {result && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">결과:</h3>
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
