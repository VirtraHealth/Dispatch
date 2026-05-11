'use client'

interface StepNavProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export function StepNav({ currentStep, totalSteps, labels }: StepNavProps) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-sans transition-colors ${
              i < currentStep
                ? 'bg-indigo-600 text-white'
                : i === currentStep
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {i < currentStep ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-12 h-px ${i < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
      <span className="ml-2 text-sm text-gray-500 font-sans">{labels[currentStep]}</span>
    </div>
  )
}
