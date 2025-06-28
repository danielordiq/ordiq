import { StepContent } from './StepContent'
import { WizardProvider } from '../WizardProvider'

interface Props {
  params: { step: string }
}

export default function StepPage({ params }: Props) {
  const stepNumber = parseInt(params.step)

  if (stepNumber < 1 || stepNumber > 5) {
    return <div>Invalid step</div>
  }

  return (
    <WizardProvider>
      <StepContent step={stepNumber} />
    </WizardProvider>
  )
}