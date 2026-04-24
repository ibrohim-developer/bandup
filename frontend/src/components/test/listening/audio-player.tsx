'use client'

import { useAudioPlayer } from '@/hooks/use-audio-player'
import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AudioPlayerProps {
  audioUrl: string
  onEnded?: () => void
  allowReplay?: boolean
  autoPlay?: boolean
  examMode?: boolean
}

export function AudioPlayer({ audioUrl, onEnded, allowReplay = false, autoPlay = false, examMode = false }: AudioPlayerProps) {
  const [hasEnded, setHasEnded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const {
    isPlaying,
    isLoaded,
    currentTime,
    duration,
    progress,
    toggle,
    setVolume,
  } = useAudioPlayer(audioUrl, {
    autoPlay: autoPlay || examMode,
    onEnded: () => {
      setHasEnded(true)
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

  const canToggle = isLoaded && (allowReplay || !hasEnded)

  return (
    <div className="flex items-center gap-4 rounded-full border bg-card px-4 py-3 shadow-sm">
      <Button
        size="icon"
        variant="ghost"
        onClick={toggle}
        disabled={!canToggle}
        className="h-12 w-12 rounded-full shrink-0"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>

      {isPlaying && (
        <div className="flex items-end gap-0.5 h-5 shrink-0" aria-hidden>
          <span className="w-1 bg-primary rounded-full animate-[equalizer_0.9s_ease-in-out_infinite]" style={{ height: '60%', animationDelay: '0ms' }} />
          <span className="w-1 bg-primary rounded-full animate-[equalizer_0.9s_ease-in-out_infinite]" style={{ height: '100%', animationDelay: '150ms' }} />
          <span className="w-1 bg-primary rounded-full animate-[equalizer_0.9s_ease-in-out_infinite]" style={{ height: '70%', animationDelay: '300ms' }} />
        </div>
      )}

      <span className="text-sm tabular-nums text-muted-foreground shrink-0 w-12 text-right">
        {formatTime(currentTime)}
      </span>

      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full bg-primary transition-[width] duration-150',
            hasEnded && !allowReplay && 'bg-muted-foreground/40'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-sm tabular-nums text-muted-foreground shrink-0 w-12">
        {formatTime(duration)}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleMuteToggle}
        className="h-11 w-11 rounded-full shrink-0"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  )
}
