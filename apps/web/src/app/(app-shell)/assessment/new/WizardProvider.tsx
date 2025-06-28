'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WizardContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  totalSteps: number
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

interface WizardProviderProps {
  children: ReactNode
  totalSteps?: number
}

export function WizardProvider({ children, totalSteps = 5 }: WizardProviderProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <WizardContext.Provider value={{
      currentStep,
      setCurrentStep,
      nextStep,
      prevStep,
      totalSteps
    }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}