import { PlusIcon, DownloadIcon, UploadIcon, SettingsIcon } from "lucide-react"

const actions = [
  { name: "Add New User", icon: PlusIcon, color: "bg-blue-500 hover:bg-blue-600" },
  { name: "Add Product", icon: PlusIcon, color: "bg-green-500 hover:bg-green-600" },
  { name: "Export Data", icon: DownloadIcon, color: "bg-purple-500 hover:bg-purple-600" },
  { name: "Import Data", icon: UploadIcon, color: "bg-orange-500 hover:bg-orange-600" },
  { name: "Settings", icon: SettingsIcon, color: "bg-gray-500 hover:bg-gray-600" },
]

export default function QuickActions() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.name}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition duration-200 ${action.color}`}>
            <action.icon className="w-5 h-5" />
            <span className="font-medium">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
