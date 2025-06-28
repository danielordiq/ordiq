
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WizardState {
  currentStep: number
  formData: Record<string, any>
}

interface WizardContextType {
  state: WizardState
  updateFormData: (stepData: Record<string, any>) => void
  nextStep: () => void
  prevStep: () => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

interface WizardProviderProps {
  children: ReactNode
}

export function WizardProvider({ children }: WizardProviderProps) {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    formData: {}
  })

  const updateFormData = (stepData: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...stepData }
    }))
  }

  const nextStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 5)
    }))
  }

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }))
  }

  const contextValue: WizardContextType = {
    state,
    updateFormData,
    nextStep,
    prevStep
  }

  return (
    <WizardContext.Provider value={contextValue}>
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
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WizardContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  formData: Record<string, any>
  updateFormData: (data: Record<string, any>) => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}

interface WizardProviderProps {
  children: ReactNode
}

export function WizardProvider({ children }: WizardProviderProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const updateFormData = (data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  return (
    <WizardContext.Provider value={{
      currentStep,
      setCurrentStep,
      formData,
      updateFormData
    }}>
      {children}
    </WizardContext.Provider>
  )
}
