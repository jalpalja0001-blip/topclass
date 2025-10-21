// 클라이언트 사이드 비디오 압축
// 50MB 제한을 우회하기 위한 압축 기능

export interface CompressionOptions {
  maxSizeMB: number
  quality: number // 0.1 - 1.0
  maxWidth: number
  maxHeight: number
}

export class VideoCompressor {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
  }

  async compressVideo(
    file: File, 
    options: CompressionOptions = {
      maxSizeMB: 50,
      quality: 0.7,
      maxWidth: 1280,
      maxHeight: 720
    }
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      
      video.onloadedmetadata = () => {
        // 비디오 크기 계산
        const { width, height } = this.calculateDimensions(
          video.videoWidth, 
          video.videoHeight, 
          options.maxWidth, 
          options.maxHeight
        )

        this.canvas.width = width
        this.canvas.height = height

        // 압축된 비디오 생성
        this.createCompressedVideo(video, options, resolve, reject)
      }

      video.onerror = () => reject(new Error('비디오 로드 실패'))
      video.src = URL.createObjectURL(file)
    })
  }

  private calculateDimensions(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth: number, 
    maxHeight: number
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight

    let width = originalWidth
    let height = originalHeight

    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio
    }

    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    return { width: Math.round(width), height: Math.round(height) }
  }

  private createCompressedVideo(
    video: HTMLVideoElement,
    options: CompressionOptions,
    resolve: (file: File) => void,
    reject: (error: Error) => void
  ) {
    const stream = this.canvas.captureStream(30) // 30fps
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 1000000 // 1Mbps
    })

    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const compressedFile = new File([blob], video.src.split('/').pop() || 'compressed.webm', {
        type: 'video/webm'
      })

      // 파일 크기 확인
      const sizeMB = compressedFile.size / (1024 * 1024)
      
      if (sizeMB <= options.maxSizeMB) {
        resolve(compressedFile)
      } else {
        // 더 강한 압축 시도
        this.compressVideoWithLowerQuality(video, options, resolve, reject)
      }
    }

    // 비디오 재생 및 캔버스에 그리기
    video.currentTime = 0
    video.play()

    const drawFrame = () => {
      if (!video.paused && !video.ended) {
        this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height)
        requestAnimationFrame(drawFrame)
      }
    }

    video.onplay = () => {
      mediaRecorder.start()
      drawFrame()
    }

    // 10초 후 녹화 중지 (테스트용)
    setTimeout(() => {
      mediaRecorder.stop()
    }, 10000)
  }

  private compressVideoWithLowerQuality(
    video: HTMLVideoElement,
    options: CompressionOptions,
    resolve: (file: File) => void,
    reject: (error: Error) => void
  ) {
    // 더 낮은 품질로 재시도
    const lowerQualityOptions = {
      ...options,
      quality: options.quality * 0.7,
      maxWidth: options.maxWidth * 0.8,
      maxHeight: options.maxHeight * 0.8
    }

    this.createCompressedVideo(video, lowerQualityOptions, resolve, reject)
  }
}

// 사용 예시
export const compressVideoForUpload = async (file: File): Promise<File> => {
  const compressor = new VideoCompressor()
  
  try {
    const compressedFile = await compressor.compressVideo(file, {
      maxSizeMB: 50,
      quality: 0.7,
      maxWidth: 1280,
      maxHeight: 720
    })

    console.log(`압축 완료: ${file.size / (1024 * 1024)}MB → ${compressedFile.size / (1024 * 1024)}MB`)
    return compressedFile

  } catch (error) {
    console.error('비디오 압축 실패:', error)
    throw error
  }
}
