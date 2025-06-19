import Sidebar from "../component/Sidebar"
import Header from "../component/Header"
import AnalyticsDashboard from "../component/analytics-dashboard";

export default function ReportsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Reports" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">

            <AnalyticsDashboard />
        </main>
      </div>
    </div>
  );
}

