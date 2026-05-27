"use client"

import { useState, useCallback } from 'react'
import { ArrowRightLeft, Copy, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
]

export function TranslatorTool() {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const translate = useCallback(async () => {
    if (!sourceText.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Using LibreTranslate API (free tier)
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: sourceText,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        }),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const data = await response.json()
      setTranslatedText(data.translatedText)
    } catch (err) {
      console.error('Translation error:', err)
      // Fallback: Use MyMemory API (free, no API key needed)
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`
        )
        const data = await response.json()
        
        if (data.responseStatus === 200) {
          setTranslatedText(data.responseData.translatedText)
        } else {
          throw new Error('Translation failed')
        }
      } catch (fallbackErr) {
        setError('Translation service is currently unavailable. Please try again later.')
      }
    } finally {
      setLoading(false)
    }
  }, [sourceText, sourceLang, targetLang])

  const swapLanguages = useCallback(() => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }, [sourceLang, targetLang, sourceText, translatedText])

  const copyTranslation = useCallback(() => {
    navigator.clipboard.writeText(translatedText)
  }, [translatedText])

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label>From</Label>
          <Select value={sourceLang} onValueChange={setSourceLang}>
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

        <Button variant="outline" size="icon" onClick={swapLanguages}>
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 space-y-2">
          <Label>To</Label>
          <Select value={targetLang} onValueChange={setTargetLang}>
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
      </div>

      {/* Text Areas */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Source Text</Label>
          <Textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="min-h-[200px]"
          />
          <p className="text-xs text-muted-foreground">
            {sourceText.length} characters
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Translation</Label>
            {translatedText && (
              <Button variant="ghost" size="sm" onClick={copyTranslation}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            )}
          </div>
          <Textarea
            value={translatedText}
            readOnly
            placeholder="Translation will appear here..."
            className="min-h-[200px] bg-secondary"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <Button onClick={translate} disabled={loading || !sourceText.trim()} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Translating...
          </>
        ) : (
          'Translate'
        )}
      </Button>

      {/* Info */}
      <div className="rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> This tool uses free translation APIs (LibreTranslate, MyMemory). 
          For production use with high volume, consider using a paid service like Google Translate or DeepL.
        </p>
      </div>
    </div>
  )
}
