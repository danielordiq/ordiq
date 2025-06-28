
export function getRiskColor(risk: string): string {
  switch (risk?.toLowerCase()) {
    case 'high':
      return 'text-riskHigh bg-riskHigh/10 border-riskHigh/20'
    case 'limited':
      return 'text-riskLimited bg-riskLimited/10 border-riskLimited/20'
    case 'minimal':
      return 'text-riskMinimal bg-riskMinimal/10 border-riskMinimal/20'
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200'
  }
}

export function getRiskTextColor(risk: string): string {
  switch (risk?.toLowerCase()) {
    case 'high':
      return 'text-riskHigh'
    case 'limited':
      return 'text-riskLimited'
    case 'minimal':
      return 'text-riskMinimal'
    default:
      return 'text-gray-600'
  }
}
