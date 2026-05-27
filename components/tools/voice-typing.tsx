"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { Mic, MicOff, Copy, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent {
  error: string
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

const languages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ar-SA', name: 'Arabic' },
]

export function VoiceTypingTool() {
  const [isListening, setIsListening] = useState(false)
  const [text, setText] = useState('')
  const [interimText, setInterimText] = useState('')
  const [language, setLanguage] = useState('en-US')
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript + ' '
        } else {
          interim += transcript
        }
      }

      if (final) {
        setText((prev) => prev + final)
      }
      setInterimText(interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setError(`Error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimText('')
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, [language])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return

    setError(null)

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.lang = language
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.error('Failed to start recognition:', err)
        setError('Failed to start voice recognition')
      }
    }
  }, [isListening, language])

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(text)
  }, [text])

  const downloadText = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'voice-transcript.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [text])

  const clearText = useCallback(() => {
    setText('')
    setInterimText('')
  }, [])

  if (!isSupported) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 text-center">
        <p className="text-destructive">
          Speech recognition is not supported in your browser. 
          Please try Chrome, Edge, or Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label>Language</Label>
          <Select value={language} onValueChange={setLanguage} disabled={isListening}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={toggleListening}
          size="lg"
          className={isListening ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-5 w-5" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              Start Listening
            </>
          )}
        </Button>
      </div>

      {/* Status */}
      {isListening && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 p-4">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
          <span className="text-red-600 dark:text-red-400">Listening...</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Text Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Transcript</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyText} disabled={!text}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadText} disabled={!text}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={clearText} disabled={!text}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          value={text + interimText}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your speech will appear here..."
          className="min-h-[300px]"
        />
        {interimText && (
          <p className="text-sm text-muted-foreground">
            <span className="italic">{interimText}</span> (processing...)
          </p>
        )}
      </div>

      {/* Tips */}
      <div className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
        <strong>Tips:</strong>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Speak clearly and at a normal pace</li>
          <li>Use a microphone in a quiet environment for best results</li>
          <li>Say punctuation like &quot;period&quot;, &quot;comma&quot;, &quot;question mark&quot;</li>
          <li>You can edit the text manually while recording</li>
        </ul>
      </div>
    </div>
  )
}
