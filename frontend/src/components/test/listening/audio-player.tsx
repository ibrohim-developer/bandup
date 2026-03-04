'use client'

import { useAudioPlayer } from '@/hooks/use-audio-player'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'

interface AudioPlayerProps {
  audioUrl: string
  onEnded?: () => void
  allowReplay?: boolean
  autoPlay?: boolean
  examMode?: boolean // Strict IELTS exam mode: no controls, auto-play, no replay
}

export function AudioPlayer({ audioUrl, onEnded, allowReplay = false, autoPlay = false, examMode = false }: AudioPlayerProps) {
  const [hasPlayed, setHasPlayed] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const {
    isPlaying,
    isLoaded,
    currentTime,
    duration,
    progress,
    play,
    pause,
    toggle,
    setVolume,
  } = useAudioPlayer(audioUrl, {
    autoPlay: autoPlay || examMode,
    onEnded: () => {
      setHasPlayed(true)
      onEnded?.()
    }
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(1)
      setIsMuted(false)
    } else {
      setVolume(0)
      setIsMuted(true)
    }
  }

  const canPlay = allowReplay || !hasPlayed

  // Exam mode: minimal UI, no controls
  if (examMode) {
    return (
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 border">
        <div className="flex items-center gap-4">
          {/* Visual indicator or manual play for first time */}
          {!hasPlayed && !isPlaying ? (
            <Button
              size="lg"
              variant="default"
              onClick={() => {
                play()
                setHasPlayed(true)
              }}
              disabled={!isLoaded}
              className="h-14 w-14 rounded-full shrink-0"
              title="Click to start audio if it doesn't play automatically"
            >
              <Play className="h-6 w-6 ml-1" />
            </Button>
          ) : (
            <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 shrink-0">
              {isPlaying ? (
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-blue-600 dark:bg-blue-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-4 bg-blue-600 dark:bg-blue-400 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-4 bg-blue-600 dark:bg-blue-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
          )}

          <div className="flex-1 space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleMuteToggle}
            className="shrink-0"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>

        <div className="mt-4 text-center">
          {isPlaying ? (
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              🔊 Audio is playing... Listen carefully, it will only play once.
            </p>
          ) : hasPlayed ? (
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              ✓ Audio has finished. You cannot replay in exam mode.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isLoaded ? 'Click play to start audio (plays only once)' : 'Loading audio...'}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Regular mode with controls
  return (
    <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 border">
      <div className="flex items-center gap-4">
        <Button
          size="lg"
          variant={isPlaying ? 'secondary' : 'default'}
          onClick={toggle}
          disabled={!isLoaded || !canPlay}
          className="h-14 w-14 rounded-full shrink-0"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
        </Button>

        <div className="flex-1 space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleMuteToggle}
          className="shrink-0"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>

      {!allowReplay && (
        <div className="mt-4 text-center">
          {hasPlayed ? (
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              Audio has been played. In the real IELTS test, you only hear it once.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Note: Audio will only play once, just like the real IELTS test
            </p>
          )}
        </div>
      )}
    </div>
  )
}
