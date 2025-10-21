// Cloudflare R2 연동을 위한 설정
// 무료 10GB 저장공간 제공

export interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  publicUrl: string
}

export class CloudflareR2Client {
  private config: R2Config

  constructor(config: R2Config) {
    this.config = config
  }

  async uploadVideo(file: File, courseId: string): Promise<{
    success: boolean
    url?: string
    error?: string
  }> {
    try {
      // 파일명 생성
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const fileName = `${courseId}_${timestamp}.${fileExtension}`
      const filePath = `videos/${fileName}`

      // R2에 업로드
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/r2/buckets/${this.config.bucketName}/objects/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.config.accessKeyId}`,
            'Content-Type': file.type,
          },
          body: file
        }
      )

      if (!response.ok) {
        throw new Error(`R2 업로드 실패: ${response.statusText}`)
      }

      const publicUrl = `${this.config.publicUrl}/${filePath}`

      return {
        success: true,
        url: publicUrl
      }

    } catch (error) {
      console.error('R2 업로드 오류:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      }
    }
  }

  async deleteVideo(filePath: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/r2/buckets/${this.config.bucketName}/objects/${filePath}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.config.accessKeyId}`,
          }
        }
      )

      if (!response.ok) {
        throw new Error(`R2 삭제 실패: ${response.statusText}`)
      }

      return { success: true }

    } catch (error) {
      console.error('R2 삭제 오류:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      }
    }
  }
}

// 환경 변수에서 설정 로드
export const r2Config: R2Config = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'course-videos',
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || ''
}

export const r2Client = new CloudflareR2Client(r2Config)
