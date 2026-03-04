"use client"

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseAudioPlayerOptions {
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  autoPlay?: boolean
}

export function useAudioPlayer(audioUrl: string, options: UseAudioPlayerOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [volume, setVolumeState] = useState(1)

  // Store callbacks in refs to avoid re-creating Audio on every render
  const onEndedRef = useRef(options.onEnded)
  const onTimeUpdateRef = useRef(options.onTimeUpdate)
  onEndedRef.current = options.onEnded
  onTimeUpdateRef.current = options.onTimeUpdate

  useEffect(() => {
    const audio = new Audio(audioUrl)
    audioRef.current = audio

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoaded(true)

      // Auto-play if enabled - with a small delay to ensure everything is ready
      if (options.autoPlay) {
        setTimeout(() => {
          audio.play().then(() => {
            setIsPlaying(true)
          }).catch((error) => {
            // Silently fail - user can still manually play if needed
            console.warn('Auto-play blocked by browser:', error.message)
          })
        }, 100)
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      onTimeUpdateRef.current?.(audio.currentTime, audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onEndedRef.current?.()
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.pause()
      audio.src = '' // Clear source to prevent memory leaks
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, options.autoPlay])

  const play = useCallback(() => {
    audioRef.current?.play()
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  const setVolume = useCallback((vol: number) => {
    const clampedVolume = Math.max(0, Math.min(1, vol))
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
    setVolumeState(clampedVolume)
  }, [])

  return {
    isPlaying,
    isLoaded,
    currentTime,
    duration,
    volume,
    play,
    pause,
    toggle,
    seek,
    setVolume,
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,
  }
}
