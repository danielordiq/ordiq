
import { ModelsTable } from './ModelsTable'

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor your assessments and compliance status</p>
      </div>
      <ModelsTable />
    </div>
  )
}
