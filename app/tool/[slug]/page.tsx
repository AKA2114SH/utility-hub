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

// Media Tools
import { SubtitlePlayerTool } from '@/components/tools/subtitle-player'

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

  return {
    title: `${tool.name} - UtilityHub`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - Free Online Tool`,
      description: tool.description,
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
