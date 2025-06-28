'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WizardData {
  purpose?: string
  users?: string[]
  dataTypes?: string[]
  location?: string
}

interface WizardContextType {
  data: WizardData
  updateData: (newData: Partial<WizardData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

interface WizardProviderProps {
  children: ReactNode
}

export function WizardProvider({ children }: WizardProviderProps) {
  const [data, setData] = useState<WizardData>({})
  const [currentStep, setCurrentStep] = useState(1)

  const updateData = (newData: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...newData }))
  }

  return (
    <WizardContext.Provider value={{ data, updateData, currentStep, setCurrentStep }}>
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