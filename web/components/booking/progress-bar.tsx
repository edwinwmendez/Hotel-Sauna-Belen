'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentStep: number
  totalSteps?: number
  steps: string[]
}

export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    isCompleted
                      ? 'bg-gold border-gold text-navy'
                      : isCurrent
                      ? 'bg-navy border-navy text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs text-center',
                    isCurrent ? 'font-semibold text-navy' : 'text-gray-500'
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-1 flex-1 mx-2 transition-all',
                    isCompleted ? 'bg-gold' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

