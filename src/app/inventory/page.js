import Sidebar from "../component/Sidebar"
import Header from "../component/Header"
import InventoryTable from "../component/InventoryTable"

export default function AccountsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Inventory Management" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <InventoryTable />
        </main>
      </div>
    </div>
  );
}
