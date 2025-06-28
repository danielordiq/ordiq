
'use client'

interface StepContentProps {
  step: number
}

export function StepContent({ step }: StepContentProps) {
  const getStepTitle = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return 'System Purpose'
      case 2:
        return 'Data & Inputs'
      case 3:
        return 'Annex III Mapping'
      case 4:
        return 'Draft Risk Level'
      case 5:
        return 'Review & Submit'
      default:
        return 'Unknown Step'
    }
  }

  const getStepDescription = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return 'Define the purpose and use case of your AI system'
      case 2:
        return 'Specify data sources and input types'
      case 3:
        return 'Map your system to EU AI Act Annex III categories'
      case 4:
        return 'Determine preliminary risk classification'
      case 5:
        return 'Review all information and submit assessment'
      default:
        return 'Step information not available'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Step {step}: {getStepTitle(step)}
          </h1>
          <span className="text-sm text-gray-500">
            {step} of 5
          </span>
        </div>
        <p className="text-gray-600">
          {getStepDescription(step)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Step {step} Content
          </h3>
          <p className="text-gray-500">
            This step is under development and will be available soon.
          </p>
        </div>
      </div>
    </div>
  )
}
