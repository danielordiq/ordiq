
import { WizardProvider } from '../WizardProvider'
import { StepContent } from './StepContent'

interface Props {
  params: {
    step: string
  }
}

export default function AssessmentStepPage({ params }: Props) {
  const stepNumber = parseInt(params.step)
  
  if (stepNumber < 1 || stepNumber > 5) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Invalid Step</h1>
        <p className="text-gray-600">Please select a valid step (1-5)</p>
      </div>
    )
  }

  return (
    <WizardProvider>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            EU AI Act Assessment - Step {stepNumber}
          </h1>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stepNumber / 5) * 100}%` }}
            />
          </div>
        </div>
        <StepContent step={stepNumber} />
      </div>
    </WizardProvider>
  )
}
