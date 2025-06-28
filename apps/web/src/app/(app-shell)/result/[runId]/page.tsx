
interface Props {
  params: {
    runId: string
  }
}

export default function ResultPage({ params }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assessment Result</h1>
        <p className="text-gray-600">Run ID: {params.runId}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">Result details coming soon...</p>
      </div>
    </div>
  )
}
