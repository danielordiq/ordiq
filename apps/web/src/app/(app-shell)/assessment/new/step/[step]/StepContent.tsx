
'use client'

import { useWizard } from '../WizardProvider'
import { PurposeStep } from '@/app/wizard/steps/PurposeStep'

interface Props {
  step: number
}

export function StepContent({ step }: Props) {
  const { data, updateData, nextStep, prevStep } = useWizard()

  switch (step) {
    case 1:
      return <PurposeStep />
    case 2:
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Data & Inputs</h2>
          <p className="text-gray-600 mt-2">Step 2 - Coming soon</p>
        </div>
      )
    case 3:
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Annex III Mapping</h2>
          <p className="text-gray-600 mt-2">Step 3 - Coming soon</p>
        </div>
      )
    case 4:
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Draft Risk Level</h2>
          <p className="text-gray-600 mt-2">Step 4 - Coming soon</p>
        </div>
      )
    case 5:
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Review & Submit</h2>
          <p className="text-gray-600 mt-2">Step 5 - Coming soon</p>
        </div>
      )
    default:
      return null
  }
}
