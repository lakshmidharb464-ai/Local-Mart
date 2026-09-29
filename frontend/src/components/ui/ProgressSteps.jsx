import React from 'react';
import { Check } from 'lucide-react';

/**
 * Multi-step checkout progress indicator.
 *
 * @param {object} props
 * @param {Array<{id: string|number, label: string}>} props.steps - Step definitions.
 * @param {number} props.currentStep - Zero-based index of the active step.
 * @param {string} [props.className]
 */
export function ProgressSteps({ steps, currentStep, className = '' }) {
  return (
    <nav aria-label="Checkout progress" className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <React.Fragment key={step.id}>
            {/* Step circle + label */}
            <div
              className="flex flex-col items-center gap-1.5 min-w-0"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                  border-2 transition-all duration-300
                  ${isCompleted
                    ? 'bg-farmGreen-600 border-farmGreen-600 text-white'
                    : isCurrent
                      ? 'bg-white border-farmGreen-600 text-farmGreen-700'
                      : 'bg-white border-gray-200 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">{index + 1}</span>
                )}
                <span className="sr-only">
                  Step {index + 1}: {step.label}
                  {isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ' (upcoming)'}
                </span>
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap transition-colors duration-300 hidden sm:block ${
                  isCurrent ? 'text-farmGreen-700' : isCompleted ? 'text-farmGreen-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 sm:mb-6 rounded-full transition-colors duration-300 ${
                  index < currentStep ? 'bg-farmGreen-500' : 'bg-gray-200'
                }`}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default ProgressSteps;
