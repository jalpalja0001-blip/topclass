'use client'

import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Settings } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  onProgress?: (progress: { playedSeconds: number; played: number }) => void
  onEnded?: () => void
  initialTime?: number
}

export default function VideoPlayer({
  url,
  onProgress,
  onEnded,
  initialTime = 0,
}: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (initialTime > 0 && playerRef.current) {
      playerRef.current.seekTo(initialTime, 'seconds')
    }
  }, [initialTime])

  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      
      if (playing) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    resetControlsTimeout()
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [playing, showControls])

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number }) => {
    setPlayed(state.played)
    setLoaded(state.loaded)
    onProgress?.(state)
  }

  const handleSeek = (value: number) => {
    const seekTo = value / 100
    setPlayed(seekTo)
    playerRef.current?.seekTo(seekTo)
  }

  const handleSkipForward = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0
    playerRef.current?.seekTo(Math.min(currentTime + 10, duration))
  }

  const handleSkipBackward = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0
    playerRef.current?.seekTo(Math.max(currentTime - 10, 0))
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value / 100)
    setMuted(value === 0)
  }

  const toggleMute = () => {
    setMuted(!muted)
  }

  const handleFullscreen = () => {
    const playerElement = playerRef.current?.getInternalPlayer()?.parentElement
    if (playerElement?.requestFullscreen) {
      playerElement.requestFullscreen()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

  return (
    <div
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={setDuration}
        onEnded={onEnded}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
      />

      {/* Custom Controls */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-colors"
        >
          {playing ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>
      </div>

      {/* Bottom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={played * 100}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${played * 100}%, rgba(255,255,255,0.3) ${played * 100}%, rgba(255,255,255,0.3) 100%)`,
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Skip Backward */}
            <button
              onClick={handleSkipBackward}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={handleSkipForward}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={muted ? 0 : volume * 100}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm">
              {formatTime(played * duration)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {showSettings && (
                <div className="absolute bottom-8 right-0 bg-black/90 rounded-lg p-3 min-w-32">
                  <div className="text-white text-sm mb-2">재생 속도</div>
                  {playbackRates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate)
                        setShowSettings(false)
                      }}
                      className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-white/20 ${
                        playbackRate === rate ? 'text-blue-400' : 'text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
