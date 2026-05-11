'use client'

type Frequency = 'daily' | 'weekly' | 'biweekly' | 'monthly'

const OPTIONS: { value: Frequency; label: string; description: string }[] = [
  { value: 'daily', label: 'Daily', description: 'Every morning' },
  { value: 'weekly', label: 'Weekly', description: 'Once a week' },
  { value: 'biweekly', label: 'Biweekly', description: 'Twice a week' },
  { value: 'monthly', label: 'Monthly', description: 'Once a month' },
]

interface FrequencyPickerProps {
  value: Frequency
  onChange: (value: Frequency) => void
}

export function FrequencyPicker({ value, onChange }: FrequencyPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`p-4 rounded-lg border text-left transition-all ${
            value === opt.value
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`font-semibold text-sm font-sans ${value === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>
            {opt.label}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 font-sans">{opt.description}</div>
        </button>
      ))}
    </div>
  )
}
