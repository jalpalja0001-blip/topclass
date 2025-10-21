'use client';

import { useEffect, useRef } from 'react';

interface VimeoPlayerProps {
  vimeoUrl: string;
  width?: number | string;
  height?: number | string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
}

export default function VimeoPlayer({
  vimeoUrl,
  width = '100%',
  height = 'auto',
  autoplay = false,
  muted = false,
  loop = false,
  controls = true,
  className = ''
}: VimeoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Vimeo URL에서 비디오 ID 추출
  const getVimeoId = (url: string): string | null => {
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/,
      /vimeo\.com\/channels\/[^\/]+\/(\d+)/,
      /vimeo\.com\/groups\/[^\/]+\/videos\/(\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const vimeoId = getVimeoId(vimeoUrl);

  useEffect(() => {
    if (!vimeoId || !iframeRef.current) return;

    // Vimeo Player API 로드
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [vimeoId]);

  if (!vimeoId) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-500">
          <div className="text-lg font-medium mb-2">❌ 잘못된 Vimeo URL</div>
          <div className="text-sm">
            올바른 Vimeo URL을 입력해주세요.<br />
            예: https://vimeo.com/123456789
          </div>
        </div>
      </div>
    );
  }

  // Vimeo 임베드 URL 생성
  const embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}&responsive=1&dnt=1`;

  return (
    <div className={`relative ${className}`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width={width}
        height={height}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full rounded-lg shadow-lg"
        style={{
          aspectRatio: '16/9',
          minHeight: '300px'
        }}
      />
      
      {/* Vimeo 로고 오버레이 (선택사항) */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
        Powered by Vimeo
      </div>
    </div>
  );
}

// Vimeo URL 유효성 검사 함수
export const isValidVimeoUrl = (url: string): boolean => {
  const patterns = [
    /^https?:\/\/(www\.)?vimeo\.com\/\d+/,
    /^https?:\/\/player\.vimeo\.com\/video\/\d+/,
    /^https?:\/\/(www\.)?vimeo\.com\/channels\/[^\/]+\/\d+/,
    /^https?:\/\/(www\.)?vimeo\.com\/groups\/[^\/]+\/videos\/\d+/
  ];

  return patterns.some(pattern => pattern.test(url));
};

// Vimeo URL을 표준 형식으로 변환
export const normalizeVimeoUrl = (url: string): string => {
  const vimeoId = url.match(/(\d+)/)?.[1];
  if (vimeoId) {
    return `https://vimeo.com/${vimeoId}`;
  }
  return url;
};
