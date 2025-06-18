import { TrendingUpIcon, UsersIcon, ShoppingBagIcon, DollarSignIcon } from "lucide-react"

const stats = [
  {
    name: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive",
    icon: DollarSignIcon,
  },
  {
    name: "Total Users",
    value: "2,350",
    change: "+180.1%",
    changeType: "positive",
    icon: UsersIcon,
  },
  {
    name: "Total Products",
    value: "12,234",
    change: "+19%",
    changeType: "positive",
    icon: ShoppingBagIcon,
  },
  {
    name: "Active Sessions",
    value: "573",
    change: "+201",
    changeType: "positive",
    icon: TrendingUpIcon,
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span
                  className={`${stat.changeType === "positive" ? "text-green-600" : "text-red-600"} font-medium`}>
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
