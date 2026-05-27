"use client"

import { useState, useMemo } from 'react'
import { Calendar, Cake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState('')
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0])

  const ageDetails = useMemo(() => {
    if (!birthDate || !targetDate) return null

    const birth = new Date(birthDate)
    const target = new Date(targetDate)

    if (birth > target) return null

    // Calculate years, months, days
    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    // Calculate total values
    const diffMs = target.getTime() - birth.getTime()
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60

    // Next birthday
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

    // Day of week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const birthDayOfWeek = daysOfWeek[birth.getDay()]

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      daysUntilBirthday,
      birthDayOfWeek,
      nextBirthday: nextBirthday.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  }, [birthDate, targetDate])

  const setToday = () => {
    setTargetDate(new Date().toISOString().split('T')[0])
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date of Birth</Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={targetDate}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetDate">Calculate Age On</Label>
          <div className="flex gap-2">
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={birthDate}
            />
            <Button variant="outline" onClick={setToday}>
              Today
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {ageDetails && (
        <div className="space-y-6">
          {/* Main Age Display */}
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-cyan-500" />
            <h2 className="text-4xl font-bold text-foreground">
              {ageDetails.years} years, {ageDetails.months} months, {ageDetails.days} days
            </h2>
            <p className="mt-2 text-muted-foreground">
              You were born on a {ageDetails.birthDayOfWeek}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Years</p>
              <p className="text-2xl font-semibold">{ageDetails.years}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Months</p>
              <p className="text-2xl font-semibold">{ageDetails.totalMonths.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Weeks</p>
              <p className="text-2xl font-semibold">{ageDetails.totalWeeks.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Days</p>
              <p className="text-2xl font-semibold">{ageDetails.totalDays.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-semibold">{ageDetails.totalHours.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Total Minutes</p>
              <p className="text-2xl font-semibold">{ageDetails.totalMinutes.toLocaleString()}</p>
            </div>
          </div>

          {/* Next Birthday */}
          <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
            <Cake className="h-8 w-8 text-pink-500" />
            <div>
              <p className="font-medium">Next Birthday</p>
              <p className="text-sm text-muted-foreground">
                {ageDetails.nextBirthday} ({ageDetails.daysUntilBirthday} days away)
              </p>
            </div>
          </div>
        </div>
      )}

      {!birthDate && (
        <div className="py-12 text-center text-muted-foreground">
          Enter your date of birth to calculate your age
        </div>
      )}
    </div>
  )
}
