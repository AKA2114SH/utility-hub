"use client"

import { useState, useCallback } from 'react'
import { Copy, Download, Loader2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileDropzone } from '@/components/file-dropzone'

export function PdfToTextTool() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const extractText = useCallback(async (pdfFile: File) => {
    setLoading(true)
    setError(null)
    setText('')

    try {
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let fullText = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
        fullText += `--- Page ${i} ---\n${pageText}\n\n`
      }

      setText(fullText.trim())
    } catch (err) {
      console.error('PDF extraction error:', err)
      setError('Failed to extract text from PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    extractText(selectedFile)
  }, [extractText])

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(text)
  }, [text])

  const downloadText = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file?.name.replace('.pdf', '') || 'extracted'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [text, file])

  const reset = useCallback(() => {
    setFile(null)
    setText('')
    setError(null)
  }, [])

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept=".pdf,application/pdf"
          onFileSelect={handleFileSelect}
          label="Drop your PDF here or click to upload"
          hint="Supports PDF files up to 50MB"
        />
      ) : (
        <>
          {/* File Info */}
          <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              Choose Another
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Extracting text...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
              {error}
            </div>
          )}

          {/* Result */}
          {text && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Extracted Text</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadText}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
              <Textarea
                value={text}
                readOnly
                className="min-h-[400px] font-mono text-sm"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
