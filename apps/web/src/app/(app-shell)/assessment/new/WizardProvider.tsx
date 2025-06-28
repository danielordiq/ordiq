
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WizardData {
  purpose?: string
  dataSources?: string
  personalData?: boolean
  annexRef?: string
  riskLevel?: 'High' | 'Limited' | 'Minimal'
}

interface WizardContextType {
  data: WizardData
  updateData: (updates: Partial<WizardData>) => void
  nextStep: () => void
  prevStep: () => void
  currentStep: number
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export function WizardProvider({ children }: Props) {
  const [data, setData] = useState<WizardData>({})
  const [currentStep, setCurrentStep] = useState(1)

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <WizardContext.Provider value={{
      data,
      updateData,
      nextStep,
      prevStep,
      currentStep
    }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}
