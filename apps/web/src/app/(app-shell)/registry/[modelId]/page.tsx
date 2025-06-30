
interface Props {
  params: Promise<{ modelId: string }>
}

export default async function RegistryModelPage({ params }: Props) {
  const { modelId } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Model Registry</h1>
        <p className="text-gray-600">Model ID: {modelId}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">Model details and diff UI coming soon...</p>
      </div>
    </div>
  )
}
