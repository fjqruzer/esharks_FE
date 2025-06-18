import { BellIcon, SearchIcon, UserIcon } from "lucide-react"

export default function Header({ title }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>

          <button className="relative p-2 text-gray-400 hover:text-gray-600 self-center">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>

          <div className="flex items-center space-x-2 self-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden xs:inline">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
}