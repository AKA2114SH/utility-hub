import {
  FileText,
  Image,
  Calculator,
  Languages,
  Mic,
  Table,
  Ruler,
  Subtitles,
  FileImage,
  FileDown,
  Minimize2,
  Eraser,
  type LucideIcon
} from 'lucide-react'
import type { IconName } from '@/lib/tools-data'

const iconMap: Record<IconName, LucideIcon> = {
  'file-text': FileText,
  'file-down': FileDown,
  'minimize-2': Minimize2,
  'eraser': Eraser,
  'file-image': FileImage,
  'calculator': Calculator,
  'ruler': Ruler,
  'table': Table,
  'mic': Mic,
  'languages': Languages,
  'subtitles': Subtitles,
  'image': Image,
}

interface ToolIconProps {
  name: IconName
  className?: string
}

export function ToolIcon({ name, className }: ToolIconProps) {
  const Icon = iconMap[name]
  return <Icon className={className} />
}
