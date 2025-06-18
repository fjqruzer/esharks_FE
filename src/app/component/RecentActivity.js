const activities = [
  { id: 1, user: "John Doe", action: "Created new account", time: "2 minutes ago", type: "user" },
  { id: 2, user: "Jane Smith", action: "Updated product inventory", time: "5 minutes ago", type: "product" },
  { id: 3, user: "Mike Johnson", action: "Processed order #1234", time: "10 minutes ago", type: "order" },
  { id: 4, user: "Sarah Wilson", action: "Added new product category", time: "15 minutes ago", type: "product" },
  { id: 5, user: "Tom Brown", action: "Updated user permissions", time: "20 minutes ago", type: "user" },
]

export default function RecentActivity() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.type === "user"
                    ? "bg-blue-400"
                    : activity.type === "product"
                      ? "bg-green-400"
                      : "bg-yellow-400"
                }`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
