// 대용량 파일을 위한 청크 업로드 시스템
// 50MB 제한을 우회하기 위한 분할 업로드

export interface ChunkUploadOptions {
  chunkSize: number // 바이트 단위 (기본: 5MB)
  maxRetries: number // 재시도 횟수
  onProgress?: (progress: number) => void // 진행률 콜백
}

export class ChunkUploader {
  private options: ChunkUploadOptions

  constructor(options: Partial<ChunkUploadOptions> = {}) {
    this.options = {
      chunkSize: 5 * 1024 * 1024, // 5MB
      maxRetries: 3,
      ...options
    }
  }

  async uploadFile(
    file: File, 
    uploadUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<{
    success: boolean
    url?: string
    error?: string
  }> {
    try {
      const chunks = this.splitFileIntoChunks(file)
      const totalChunks = chunks.length
      const uploadId = this.generateUploadId()

      console.log(`파일 분할 완료: ${totalChunks}개 청크`)

      // 각 청크를 순차적으로 업로드
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const chunkNumber = i + 1

        console.log(`청크 ${chunkNumber}/${totalChunks} 업로드 중...`)

        const success = await this.uploadChunk(
          chunk,
          uploadUrl,
          uploadId,
          chunkNumber,
          totalChunks
        )

        if (!success) {
          throw new Error(`청크 ${chunkNumber} 업로드 실패`)
        }

        // 진행률 업데이트
        const progress = Math.round((chunkNumber / totalChunks) * 100)
        onProgress?.(progress)
      }

      // 최종 파일 조합 요청
      const finalUrl = await this.combineChunks(uploadUrl, uploadId, totalChunks)

      return {
        success: true,
        url: finalUrl
      }

    } catch (error) {
      console.error('청크 업로드 실패:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      }
    }
  }

  private splitFileIntoChunks(file: File): Blob[] {
    const chunks: Blob[] = []
    let start = 0

    while (start < file.size) {
      const end = Math.min(start + this.options.chunkSize, file.size)
      const chunk = file.slice(start, end)
      chunks.push(chunk)
      start = end
    }

    return chunks
  }

  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async uploadChunk(
    chunk: Blob,
    uploadUrl: string,
    uploadId: string,
    chunkNumber: number,
    totalChunks: number
  ): Promise<boolean> {
    let retries = 0

    while (retries < this.options.maxRetries) {
      try {
        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('uploadId', uploadId)
        formData.append('chunkNumber', chunkNumber.toString())
        formData.append('totalChunks', totalChunks.toString())

        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          return true
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

      } catch (error) {
        retries++
        console.error(`청크 ${chunkNumber} 업로드 실패 (시도 ${retries}/${this.options.maxRetries}):`, error)

        if (retries >= this.options.maxRetries) {
          return false
        }

        // 재시도 전 대기
        await new Promise(resolve => setTimeout(resolve, 1000 * retries))
      }
    }

    return false
  }

  private async combineChunks(
    uploadUrl: string,
    uploadId: string,
    totalChunks: number
  ): Promise<string> {
    const response = await fetch(`${uploadUrl}/combine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uploadId,
        totalChunks
      })
    })

    if (!response.ok) {
      throw new Error(`파일 조합 실패: ${response.statusText}`)
    }

    const result = await response.json()
    return result.url
  }
}

// 사용 예시
export const uploadLargeVideo = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{
  success: boolean
  url?: string
  error?: string
}> => {
  const uploader = new ChunkUploader({
    chunkSize: 5 * 1024 * 1024, // 5MB 청크
    maxRetries: 3
  })

  return await uploader.uploadFile(
    file,
    '/api/admin/videos/chunk-upload',
    onProgress
  )
}
