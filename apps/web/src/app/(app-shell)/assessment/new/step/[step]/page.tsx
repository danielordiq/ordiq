
interface Props {
  params: Promise<{ step: string }>
}

export default async function AssessmentStepPage({ params }: Props) {
  const { step } = await params;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assessment Step {step}</h1>
        <p className="text-gray-600">Complete this step to continue your assessment</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">Assessment step {step} content coming soon...</p>
      </div>
    </div>
  )
}
