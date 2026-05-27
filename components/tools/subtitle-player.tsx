"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { Play, Pause, Upload, SkipBack, SkipForward } from 'lucide-react'
import SrtParser from 'srt-parser-2'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { FileDropzone } from '@/components/file-dropzone'

interface Subtitle {
  id: string
  startTime: string
  startSeconds: number
  endTime: string
  endSeconds: number
  text: string
}

function timeToSeconds(time: string): number {
  const [hours, minutes, rest] = time.split(':')
  const [seconds, ms] = rest.replace(',', '.').split('.')
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + parseInt(ms || '0') / 1000
}

export function SubtitlePlayerTool() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const subtitleFileRef = useRef<HTMLInputElement>(null)

  const handleVideoSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    setSubtitles([])
    setCurrentSubtitle(null)
  }, [])

  const handleSubtitleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parser = new SrtParser()
        const result = parser.fromSrt(event.target?.result as string)
        
        const parsedSubtitles: Subtitle[] = result.map((item) => ({
          id: item.id,
          startTime: item.startTime,
          startSeconds: timeToSeconds(item.startTime),
          endTime: item.endTime,
          endSeconds: timeToSeconds(item.endTime),
          text: item.text,
        }))
        
        setSubtitles(parsedSubtitles)
      } catch (error) {
        console.error('SRT parsing error:', error)
      }
    }
    reader.readAsText(file)
    
    if (subtitleFileRef.current) {
      subtitleFileRef.current.value = ''
    }
  }, [])

  // Update current subtitle based on video time
  useEffect(() => {
    if (!subtitles.length) return

    const subtitle = subtitles.find(
      (sub) => currentTime >= sub.startSeconds && currentTime <= sub.endSeconds
    )
    setCurrentSubtitle(subtitle || null)
  }, [currentTime, subtitles])

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }, [])

  const handleSeek = useCallback((value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }, [])

  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds))
    }
  }, [duration])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const reset = useCallback(() => {
    setVideoUrl(null)
    setSubtitles([])
    setCurrentSubtitle(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  return (
    <div className="space-y-6">
      {!videoUrl ? (
        <FileDropzone
          accept="video/*"
          onFileSelect={handleVideoSelect}
          label="Drop your video here or click to upload"
          hint="Supports MP4, WebM, OGV, and more"
        />
      ) : (
        <>
          {/* Video Player */}
          <div className="relative overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              className="aspect-video w-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            
            {/* Subtitle Overlay */}
            {currentSubtitle && (
              <div className="absolute bottom-16 left-0 right-0 px-4 text-center">
                <p 
                  className="inline-block rounded bg-black/80 px-4 py-2 text-lg text-white sm:text-xl"
                  dangerouslySetInnerHTML={{ __html: currentSubtitle.text }}
                />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center gap-4">
              <span className="w-12 text-sm text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration || 100}
                step={0.1}
                className="flex-1"
              />
              <span className="w-12 text-sm text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon" onClick={() => skip(-10)}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="lg" onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={() => skip(10)}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subtitle Controls */}
          <div className="flex flex-wrap items-center gap-4 rounded-lg bg-secondary p-4">
            <Button variant="outline" onClick={() => subtitleFileRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {subtitles.length ? 'Change Subtitles' : 'Load SRT Subtitles'}
            </Button>
            <input
              ref={subtitleFileRef}
              type="file"
              accept=".srt"
              onChange={handleSubtitleSelect}
              className="hidden"
            />
            
            {subtitles.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {subtitles.length} subtitles loaded
              </span>
            )}
            
            <div className="flex-1" />
            
            <Button variant="outline" onClick={reset}>
              New Video
            </Button>
          </div>

          {/* Subtitle List */}
          {subtitles.length > 0 && (
            <div className="max-h-60 overflow-y-auto rounded-lg border border-border">
              {subtitles.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSeek([sub.startSeconds])}
                  className={`w-full border-b border-border p-3 text-left transition-colors hover:bg-accent ${
                    currentSubtitle?.id === sub.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {sub.startTime.split(',')[0]}
                    </span>
                    <p 
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: sub.text }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
