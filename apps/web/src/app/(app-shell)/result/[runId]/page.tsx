
interface Props {
  params: Promise<{ runId: string }>
}

export default async function ResultPage({ params }: Props) {
  const { runId } = await params;
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
