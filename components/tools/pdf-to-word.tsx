"use client"

import { useState, useCallback } from 'react'
import { Download, Loader2, FileText, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileDropzone } from '@/components/file-dropzone'

export function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const extractAndConvert = useCallback(async (pdfFile: File) => {
    setLoading(true)
    setError(null)
    setText('')
    setProgress(0)

    try {
      // Validate file size (50MB max)
      if (pdfFile.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit')
        setLoading(false)
        return
      }

      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let fullText = ''
      const totalPages = pdf.numPages

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        
        // Group text items by their vertical position for better paragraph detection
        const lines: { y: number; text: string }[] = []
        
        for (const item of textContent.items) {
          if ('str' in item && item.str.trim()) {
            const transform = item.transform
            const y = Math.round(transform[5])
            
            const existingLine = lines.find(l => Math.abs(l.y - y) < 5)
            if (existingLine) {
              existingLine.text += ' ' + item.str
            } else {
              lines.push({ y, text: item.str })
            }
          }
        }
        
        // Sort by vertical position (top to bottom)
        lines.sort((a, b) => b.y - a.y)
        
        const pageText = lines.map(l => l.text.trim()).join('\n')
        fullText += pageText + '\n\n'
        
        setProgress(Math.round((i / totalPages) * 100))
      }

      setText(fullText.trim())
    } catch (err) {
      console.error('PDF conversion error:', err)
      setError('Failed to convert PDF. Please try again.')
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }, [])

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    extractAndConvert(selectedFile)
  }, [extractAndConvert])

  const downloadAsDocx = useCallback(async () => {
    // Create a simple DOCX-compatible HTML
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.5; }
p { margin-bottom: 12pt; }
</style>
</head>
<body>
${text.split('\n\n').map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`).join('\n')}
</body>
</html>`

    // Create blob with DOCX-compatible format
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file?.name.replace('.pdf', '') || 'converted'}.doc`
    a.click()
    URL.revokeObjectURL(url)
  }, [text, file])

  const downloadAsRtf = useCallback(() => {
    // Create RTF content
    const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Calibri;}}
{\\colortbl;\\red0\\green0\\blue0;}
\\f0\\fs22
${text.split('\n').map(line => line.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}') + '\\par').join('\n')}
}`

    const blob = new Blob([rtfContent], { type: 'application/rtf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file?.name.replace('.pdf', '') || 'converted'}.rtf`
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
          hint="Convert PDF to editable Word document"
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
            <div className="space-y-4 py-8">
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Converting PDF... {progress}%</span>
              </div>
              <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full bg-foreground transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-medium text-foreground">Converted Content</h3>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={downloadAsDocx} className="flex-1 sm:flex-none">
                    <FileDown className="mr-2 h-4 w-4" />
                    Download .DOC
                  </Button>
                  <Button variant="outline" onClick={downloadAsRtf} className="flex-1 sm:flex-none">
                    <Download className="mr-2 h-4 w-4" />
                    Download .RTF
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-700 dark:text-blue-300">
                <strong>Tip:</strong> The .DOC file can be opened in Microsoft Word, Google Docs, or LibreOffice. 
                The .RTF format provides better formatting compatibility.
              </div>

              <Textarea
                value={text}
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
