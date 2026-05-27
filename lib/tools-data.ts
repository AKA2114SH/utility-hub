export type IconName = 
  | 'file-text' 
  | 'file-down' 
  | 'minimize-2' 
  | 'eraser' 
  | 'file-image'
  | 'calculator'
  | 'ruler'
  | 'table'
  | 'mic'
  | 'languages'
  | 'subtitles'
  | 'image'

export interface Tool {
  slug: string
  name: string
  description: string
  category: string
  iconName: IconName
  color: string
}

export const tools: Tool[] = [
  // PDF Tools
  {
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract text content from PDF files instantly',
    category: 'PDF Tools',
    iconName: 'file-text',
    color: 'bg-red-500/10 text-red-500 dark:bg-red-500/20'
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF documents to editable Word format',
    category: 'PDF Tools',
    iconName: 'file-down',
    color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20'
  },
  // Image Tools
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images without losing quality',
    category: 'Image Tools',
    iconName: 'minimize-2',
    color: 'bg-green-500/10 text-green-500 dark:bg-green-500/20'
  },
  {
    slug: 'background-remover',
    name: 'Background Remover',
    description: 'Remove background from images using filters',
    category: 'Image Tools',
    iconName: 'eraser',
    color: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20'
  },
  {
    slug: 'image-converter',
    name: 'Image Converter',
    description: 'Convert images between different formats',
    category: 'Image Tools',
    iconName: 'file-image',
    color: 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20'
  },
  // Productivity Tools
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate exact age from birth date',
    category: 'Productivity',
    iconName: 'calculator',
    color: 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20'
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    category: 'Productivity',
    iconName: 'ruler',
    color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20'
  },
  {
    slug: 'spreadsheet-editor',
    name: 'Spreadsheet Editor',
    description: 'Excel-like grid editor with import/export',
    category: 'Productivity',
    iconName: 'table',
    color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20'
  },
  // Text Tools
  {
    slug: 'voice-typing',
    name: 'Voice Typing',
    description: 'Convert speech to text using your microphone',
    category: 'Text Tools',
    iconName: 'mic',
    color: 'bg-pink-500/10 text-pink-500 dark:bg-pink-500/20'
  },
  {
    slug: 'translator',
    name: 'Translator',
    description: 'Translate text between multiple languages',
    category: 'Text Tools',
    iconName: 'languages',
    color: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20'
  },
  // Media Tools
  {
    slug: 'subtitle-player',
    name: 'Subtitle Player',
    description: 'Play videos with custom SRT subtitles',
    category: 'Media Tools',
    iconName: 'subtitles',
    color: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20'
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to exact dimensions',
    category: 'Image Tools',
    iconName: 'image',
    color: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20'
  }
]

export const categories = [...new Set(tools.map(tool => tool.category))]

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug)
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter(tool => tool.category === category)
}
