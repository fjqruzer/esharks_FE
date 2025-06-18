import Sidebar from "../component/Sidebar"
import Header from "../component/Header"
import CategoriesTable from "../component/CategoriesTable"

export default function ProductsPage() {
  return (
    <div className="flex h-screen bg-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Category Management" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            <CategoriesTable />
        </main>
      </div>
    </div>
  );
}
