"use client"

import { useState, useMemo } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const unitCategories = {
  Length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },
  Weight: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.453592,
    ounce: 0.0283495,
    ton: 1000,
  },
  Temperature: {
    celsius: 'celsius',
    fahrenheit: 'fahrenheit',
    kelvin: 'kelvin',
  },
  Area: {
    'square meter': 1,
    'square kilometer': 1000000,
    'square foot': 0.092903,
    'square yard': 0.836127,
    acre: 4046.86,
    hectare: 10000,
  },
  Volume: {
    liter: 1,
    milliliter: 0.001,
    gallon: 3.78541,
    quart: 0.946353,
    pint: 0.473176,
    cup: 0.236588,
  },
  Time: {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629800,
    year: 31557600,
  },
  Speed: {
    'meters/second': 1,
    'kilometers/hour': 0.277778,
    'miles/hour': 0.44704,
    knot: 0.514444,
  },
  Data: {
    byte: 1,
    kilobyte: 1024,
    megabyte: 1048576,
    gigabyte: 1073741824,
    terabyte: 1099511627776,
  },
}

type Category = keyof typeof unitCategories

export function UnitConverterTool() {
  const [category, setCategory] = useState<Category>('Length')
  const [fromUnit, setFromUnit] = useState('meter')
  const [toUnit, setToUnit] = useState('foot')
  const [fromValue, setFromValue] = useState('1')

  const units = Object.keys(unitCategories[category])

  const result = useMemo(() => {
    const value = parseFloat(fromValue)
    if (isNaN(value)) return ''

    const categoryUnits = unitCategories[category] as Record<string, number | string>

    // Handle temperature separately
    if (category === 'Temperature') {
      let celsius: number
      
      // Convert to Celsius first
      switch (fromUnit) {
        case 'fahrenheit':
          celsius = (value - 32) * 5/9
          break
        case 'kelvin':
          celsius = value - 273.15
          break
        default:
          celsius = value
      }

      // Convert from Celsius to target
      switch (toUnit) {
        case 'fahrenheit':
          return (celsius * 9/5 + 32).toFixed(4)
        case 'kelvin':
          return (celsius + 273.15).toFixed(4)
        default:
          return celsius.toFixed(4)
      }
    }

    // Standard conversion
    const fromFactor = categoryUnits[fromUnit] as number
    const toFactor = categoryUnits[toUnit] as number
    const baseValue = value * fromFactor
    const converted = baseValue / toFactor

    return converted.toFixed(6).replace(/\.?0+$/, '')
  }, [category, fromUnit, toUnit, fromValue])

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(result || '0')
  }

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory)
    const newUnits = Object.keys(unitCategories[newCategory])
    setFromUnit(newUnits[0])
    setToUnit(newUnits[1] || newUnits[0])
  }

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={(v) => handleCategoryChange(v as Category)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(unitCategories).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conversion Interface */}
      <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr]">
        {/* From */}
        <div className="space-y-2">
          <Label>From</Label>
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            placeholder="Enter value"
          />
        </div>

        {/* Swap Button */}
        <div className="flex items-end justify-center pb-2">
          <Button variant="outline" size="icon" onClick={swapUnits}>
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <Label>To</Label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={result}
            readOnly
            placeholder="Result"
            className="bg-secondary font-mono"
          />
        </div>
      </div>

      {/* Result Display */}
      {fromValue && result && (
        <div className="rounded-lg bg-secondary p-4 text-center">
          <p className="text-lg">
            <span className="font-semibold">{fromValue}</span> {fromUnit} ={' '}
            <span className="font-semibold text-foreground">{result}</span> {toUnit}
          </p>
        </div>
      )}

      {/* Quick Reference */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-2 font-medium">Common Conversions</h3>
        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {category === 'Length' && (
            <>
              <p>1 mile = 1.60934 kilometers</p>
              <p>1 foot = 30.48 centimeters</p>
              <p>1 inch = 2.54 centimeters</p>
              <p>1 meter = 3.28084 feet</p>
            </>
          )}
          {category === 'Weight' && (
            <>
              <p>1 kilogram = 2.20462 pounds</p>
              <p>1 pound = 16 ounces</p>
              <p>1 ounce = 28.3495 grams</p>
              <p>1 ton = 1000 kilograms</p>
            </>
          )}
          {category === 'Temperature' && (
            <>
              <p>0°C = 32°F = 273.15K</p>
              <p>100°C = 212°F = 373.15K</p>
              <p>°F = (°C × 9/5) + 32</p>
              <p>°C = (°F - 32) × 5/9</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
