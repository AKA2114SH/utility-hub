"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { Download, Upload, Plus, Trash2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const DEFAULT_ROWS = 20
const DEFAULT_COLS = 10

const getColumnLabel = (index: number): string => {
  let label = ''
  while (index >= 0) {
    label = String.fromCharCode((index % 26) + 65) + label
    index = Math.floor(index / 26) - 1
  }
  return label
}

export function SpreadsheetEditorTool() {
  const [data, setData] = useState<string[][]>(() => 
    Array(DEFAULT_ROWS).fill(null).map(() => Array(DEFAULT_COLS).fill(''))
  )
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [editValue, setEditValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
    setEditValue(data[row][col] || '')
  }

  const handleCellChange = (value: string) => {
    setEditValue(value)
    if (selectedCell) {
      const newData = [...data]
      newData[selectedCell.row] = [...newData[selectedCell.row]]
      newData[selectedCell.row][selectedCell.col] = value
      setData(newData)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return

    const { row, col } = selectedCell

    switch (e.key) {
      case 'Tab':
        e.preventDefault()
        if (col < data[0].length - 1) {
          setSelectedCell({ row, col: col + 1 })
          setEditValue(data[row][col + 1] || '')
        } else if (row < data.length - 1) {
          setSelectedCell({ row: row + 1, col: 0 })
          setEditValue(data[row + 1][0] || '')
        }
        break
      case 'Enter':
        e.preventDefault()
        if (row < data.length - 1) {
          setSelectedCell({ row: row + 1, col })
          setEditValue(data[row + 1][col] || '')
        }
        break
      case 'ArrowUp':
        if (row > 0) {
          setSelectedCell({ row: row - 1, col })
          setEditValue(data[row - 1][col] || '')
        }
        break
      case 'ArrowDown':
        if (row < data.length - 1) {
          setSelectedCell({ row: row + 1, col })
          setEditValue(data[row + 1][col] || '')
        }
        break
      case 'ArrowLeft':
        if (col > 0) {
          setSelectedCell({ row, col: col - 1 })
          setEditValue(data[row][col - 1] || '')
        }
        break
      case 'ArrowRight':
        if (col < data[0].length - 1) {
          setSelectedCell({ row, col: col + 1 })
          setEditValue(data[row][col + 1] || '')
        }
        break
    }
  }

  const addRow = () => {
    setData([...data, Array(data[0].length).fill('')])
  }

  const addColumn = () => {
    setData(data.map(row => [...row, '']))
  }

  const clearAll = () => {
    setData(Array(DEFAULT_ROWS).fill(null).map(() => Array(DEFAULT_COLS).fill('')))
    setSelectedCell(null)
    setEditValue('')
  }

  const importFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 })
        
        // Ensure minimum size
        const maxCols = Math.max(DEFAULT_COLS, ...jsonData.map(row => row.length))
        const paddedData = jsonData.map(row => {
          const newRow = [...(row as string[])]
          while (newRow.length < maxCols) newRow.push('')
          return newRow.map(cell => String(cell ?? ''))
        })
        
        while (paddedData.length < DEFAULT_ROWS) {
          paddedData.push(Array(maxCols).fill(''))
        }
        
        setData(paddedData)
      } catch (error) {
        console.error('Import error:', error)
      }
    }
    reader.readAsArrayBuffer(file)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const exportFile = (format: 'xlsx' | 'csv') => {
    const worksheet = XLSX.utils.aoa_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    
    if (format === 'xlsx') {
      XLSX.writeFile(workbook, 'spreadsheet.xlsx')
    } else {
      XLSX.writeFile(workbook, 'spreadsheet.csv')
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={importFile}
          className="hidden"
        />
        <Button variant="outline" size="sm" onClick={() => exportFile('xlsx')}>
          <Download className="mr-2 h-4 w-4" />
          Export XLSX
        </Button>
        <Button variant="outline" size="sm" onClick={() => exportFile('csv')}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-2 h-4 w-4" />
          Row
        </Button>
        <Button variant="outline" size="sm" onClick={addColumn}>
          <Plus className="mr-2 h-4 w-4" />
          Column
        </Button>
        <Button variant="outline" size="sm" onClick={clearAll}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Formula Bar */}
      <div className="flex items-center gap-2 rounded-lg bg-secondary p-2">
        <span className="w-16 text-center text-sm font-medium text-muted-foreground">
          {selectedCell ? `${getColumnLabel(selectedCell.col)}${selectedCell.row + 1}` : '-'}
        </span>
        <Input
          value={editValue}
          onChange={(e) => handleCellChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Select a cell to edit"
          disabled={!selectedCell}
          className="flex-1"
        />
      </div>

      {/* Spreadsheet Grid */}
      <div className="overflow-auto rounded-lg border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-20 min-w-[40px] border-b border-r border-border bg-secondary p-2 text-center text-xs font-medium text-muted-foreground">
                #
              </th>
              {data[0].map((_, colIndex) => (
                <th
                  key={colIndex}
                  className="sticky top-0 z-10 min-w-[100px] border-b border-r border-border bg-secondary p-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {getColumnLabel(colIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="sticky left-0 z-10 border-b border-r border-border bg-secondary p-2 text-center text-xs font-medium text-muted-foreground">
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`min-w-[100px] cursor-cell border-b border-r border-border p-0 ${
                      selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                        ? 'ring-2 ring-inset ring-foreground'
                        : ''
                    }`}
                  >
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => {
                        if (selectedCell?.row === rowIndex && selectedCell?.col === colIndex) {
                          handleCellChange(e.target.value)
                        }
                      }}
                      onFocus={() => handleCellClick(rowIndex, colIndex)}
                      onKeyDown={handleKeyDown}
                      className="h-8 w-full bg-transparent px-2 text-sm outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Use Tab, Enter, or Arrow keys to navigate • Import/Export Excel or CSV files
      </p>
    </div>
  )
}
