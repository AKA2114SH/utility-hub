import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { tools, getToolBySlug } from '@/lib/tools-data'
import { ToolWrapper } from '@/components/tool-wrapper'

// PDF Tools
import { PdfToTextTool } from '@/components/tools/pdf-to-text'
import { PdfToWordTool } from '@/components/tools/pdf-to-word'

// Image Tools
import { ImageCompressorTool } from '@/components/tools/image-compressor'
import { BackgroundRemoverTool } from '@/components/tools/background-remover'
import { ImageConverterTool } from '@/components/tools/image-converter'
import { ImageResizerTool } from '@/components/tools/image-resizer'

// Productivity Tools
import { AgeCalculatorTool } from '@/components/tools/age-calculator'
import { UnitConverterTool } from '@/components/tools/unit-converter'
import { SpreadsheetEditorTool } from '@/components/tools/spreadsheet-editor'

// Text Tools
import { VoiceTypingTool } from '@/components/tools/voice-typing'
import { TranslatorTool } from '@/components/tools/translator'
import { TextCaseConverter } from '@/components/tools/text-case-converter'
import { MarkdownPreview } from '@/components/tools/markdown-preview'

// Developer Tools
import { PasswordGenerator } from '@/components/tools/password-generator'
import { JSONFormatter } from '@/components/tools/json-formatter'
import { ColorConverter } from '@/components/tools/color-converter'
import { HashGenerator } from '@/components/tools/hash-generator'
import { QRCodeGenerator } from '@/components/tools/qr-code-generator'

// Media Tools
import { SubtitlePlayerTool } from '@/components/tools/subtitle-player'

// Additional Productivity
import { TodoList } from '@/components/tools/todo-list'

const toolComponents: Record<string, React.ComponentType> = {
  'pdf-to-text': PdfToTextTool,
  'pdf-to-word': PdfToWordTool,
  'image-compressor': ImageCompressorTool,
  'background-remover': BackgroundRemoverTool,
  'image-converter': ImageConverterTool,
  'image-resizer': ImageResizerTool,
  'age-calculator': AgeCalculatorTool,
  'unit-converter': UnitConverterTool,
  'spreadsheet-editor': SpreadsheetEditorTool,
  'voice-typing': VoiceTypingTool,
  'translator': TranslatorTool,
  'subtitle-player': SubtitlePlayerTool,
  'text-case-converter': TextCaseConverter,
  'password-generator': PasswordGenerator,
  'json-formatter': JSONFormatter,
  'markdown-preview': MarkdownPreview,
  'color-converter': ColorConverter,
  'hash-generator': HashGenerator,
  'qr-code-generator': QRCodeGenerator,
  'todo-list': TodoList,
}

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }))
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
    }
  }

  const fullTitle = `Free ${tool.name} Online Tool - UtilityHub`
  const fullDescription = `${tool.description} Free, fast, and completely private. Everything runs in your browser with no server uploads.`

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [tool.name, tool.category, 'free online tool', 'privacy', 'no uploads'],
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      type: 'website',
      url: `/tool/${slug}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${tool.name} - Free Online Tool`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `/tool/${slug}`,
    },
  }
}

export default async function ToolPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  
  if (!tool) {
    notFound()
  }

  const ToolComponent = toolComponents[slug]
  
  if (!ToolComponent) {
    notFound()
  }

  return (
    <ToolWrapper tool={tool}>
      <ToolComponent />
    </ToolWrapper>
  )
}
