import { StepContent } from './StepContent'
import { WizardProvider } from '../WizardProvider'

interface Props {
  params: Promise<{ step: string }>
}

export default async function StepPage({ params }: Props) {
  const { step } = await params
  const stepNumber = parseInt(step)

  if (stepNumber < 1 || stepNumber > 5) {
    return <div>Invalid step</div>
  }

  return (
    <WizardProvider>
      <StepContent step={stepNumber} />
    </WizardProvider>
  )
}