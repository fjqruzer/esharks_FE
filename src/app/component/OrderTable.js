"use client"

import { useState, useEffect } from "react"
import { EyeIcon, ChevronLeft, ChevronRight, Package, Clock, Truck, CheckCircle, Calendar, ScissorsLineDashed, Printer } from "lucide-react"

export default function OrderTable() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false) // Added
  const [updatingStatus, setUpdatingStatus] = useState(false) // Added

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Fetch orders from API
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      try {
        const token = localStorage.getItem("jwt")
        setToken(token)

        const res = await fetch("/api/orders/adminOrders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
        setOrders([]) // Fallback to empty array if error
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Filter orders based on active tab
  useEffect(() => {
    let filtered = orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (activeTab) {
      case "new":
        filtered = orders.filter((order) => {
          const orderDate = new Date(order.created_at)
          orderDate.setHours(0, 0, 0, 0)
          return orderDate.getTime() === today.getTime()
        })
        break
      case "processing":
       
        filtered = orders.filter((order) => order.IsReceived === "processing")
        break
      case "in_transit":
        filtered = orders.filter((order) => order.IsReceived === "in_transit")
        break
      case "completed":
        filtered = orders.filter((order) => order.IsReceived === "completed")
        break
      default:
        filtered = orders
    }

    setFilteredOrders(filtered)
    setCurrentPage(1) // Reset to first page when changing tabs
  }, [orders, activeTab])

  const tabs = [
    {
      id: "new",
      label: "New Orders",
      icon: Calendar,
      count: orders.filter((order) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const orderDate = new Date(order.created_at)
        orderDate.setHours(0, 0, 0, 0)
        return orderDate.getTime() === today.getTime()
      }).length,
    },
    { id: "all", label: "All Orders", icon: Package, count: orders.length },
    {
      id: "processing",
      label: "Processing",
      icon: Clock,
      color: "text-yellow-800",
      count: orders.filter((order) => order.IsReceived === "processing").length,
    },
    {
      id: "in_transit",
      label: "In Transit",
      icon: Truck,
      color: "text-blue-800",
      count: orders.filter((order) => order.IsReceived === "in_transit").length,
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckCircle,
      color: "text-green-800",
      count: orders.filter((order) => order.IsReceived === "completed").length,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-200 text-yellow-800"
      case "in_transit":
        return "bg-blue-200 text-blue-800"
      case "completed":
        return "bg-green-200 text-green-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Helper to display readable status (from the previous code, adjusted for 'status' field)
  const getReadableStatus = (status) => {
    switch (status) {
      case "processing":
        return "Processing"
      case "in_transit":
        return "In Transit"
      case "completed":
        return "Completed"
      default:
        return "Other"
    }
  }

  // Pagination logic
  const totalItems = filteredOrders.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  // Added handleStatusUpdate function
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder) return

    setUpdatingStatus(true)
    try {
     
      const response = await fetch(
        `https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/orders/update/${selectedOrder.OrderID}`,
        { 
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            IsReceived: newStatus, 
          }),
        }
      )

      if (response.ok) {
        // Update the orders state with the new IsReceived value
        const updatedOrders = orders.map((order) =>
          order.OrderID === selectedOrder.OrderID ? { ...order, IsReceived: newStatus } : order
        )
        setOrders(updatedOrders)

        // Update the selected order in the modal
        setSelectedOrder({ ...selectedOrder, IsReceived: newStatus })

        setShowStatusModal(false)
        setShowModal(true)
        alert(`Order status updated to ${newStatus.replace("_", " ")}`)
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Failed to update order status. Please try again.")
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Order Management</h3>
        {/* Status Legends */}
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-4 h-4 rounded-full bg-yellow-200 border border-yellow-400"></span>
            <span className="text-sm text-yellow-800">Processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-4 h-4 rounded-full bg-blue-200 border border-blue-400"></span>
            <span className="text-sm text-blue-800">In Transit</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-4 h-4 rounded-full bg-green-200 border border-green-400"></span>
            <span className="text-sm text-green-800">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-4 h-4 rounded-full bg-gray-200 border border-gray-400"></span>
            <span className="text-sm text-gray-800">Other</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        {/* Mobile: Dropdown */}
        <div className="sm:hidden px-6 py-2">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label} ({tab.count})
              </option>
            ))}
          </select>
        </div>
        {/* Desktop: Tab Buttons */}
        <nav className="hidden sm:flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${isActive
                    ? (tab.color || "border-blue-500 text-blue-600") + " border-b-2"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${isActive
                      ? (tab.color || "bg-blue-100 text-blue-600")
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Orders Grid */}
      {!loading && (
        <div className="p-6">
          {paginatedOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === "new" ? "No new orders today." : `No ${activeTab} orders at the moment.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedOrders.map((order) => (
                <div
                  key={order.id} // Changed to order.id assuming it's the unique key
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                       
                        <h4 className="text-lg font-semibold text-gray-900">   <span
                        className={`inline-flex items-center px-2 py-2 me-2 rounded-full text-xs font-medium ${getStatusColor(order.IsReceived)}`}
                      ></span>Order #{order.OrderID}</h4>
                        
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Order Details */}

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">User ID:</span>
                        <span className="text-sm font-medium text-gray-900">{order.user_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Address ID:</span>
                        <span className="text-sm font-medium text-gray-900">{order.address_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment Method:</span>
                        <span className="text-sm font-medium text-gray-900">{order.MOP}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Received:</span>
                        <span className={`text-sm font-medium ${order.IsReceived === "completed" ? "text-green-600" : "text-red-600"}`}>
                          {order.IsReceived === "completed" ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-sm text-gray-500">Total:</span>
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end space-x-3"> {/* Added space-x-3 for buttons */}
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <EyeIcon className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      {/* Added Update Status button to card
                      <button
                        onClick={() => {
                          setSelectedOrder(order); // Set the order before opening status modal
                          setShowStatusModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Update Status
                      </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && filteredOrders.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    aria-current={currentPage === i + 1 ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                      currentPage === i + 1 ? "z-10 bg-blue-600 text-white" : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      {/* Order Details Modal */}
      {showModal && selectedOrder && (

        <div className="fixed inset-0 bg-neutral-900/90 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative my-2 mx-auto p-5 b md:w-3/4 lg:w-1/2  rounded-md bg-white">


            <div className="flex justify-between items-center mb-6">

              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              {/* <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button> */}
            </div>

            <div className="space-y-6">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Order #{selectedOrder.OrderID}</h4>
                    <p className="text-sm text-gray-500 mt-1">Created: {formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}
                  >
                    {selectedOrder.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900 border-b pb-2">Customer Information</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOrder.user
                          ? `${selectedOrder.user.FirstName} ${selectedOrder.user.MI}. ${selectedOrder.user.LastName}`
                          : selectedOrder.user_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOrder.user?.email || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOrder.user?.Phone_Number || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">School ID:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOrder.user?.SchoolID || "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900 border-b pb-2">Shipping Address</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Address:</span>
                      <span className="text-sm font-medium text-gray-900 text-right">
                        {selectedOrder.address
                          ? `${selectedOrder.address.address_line}, ${selectedOrder.address.city}, ${selectedOrder.address.province}, ${selectedOrder.address.postal_code}, ${selectedOrder.address.country}`
                          : selectedOrder.address_id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900 border-b pb-2">Payment Information</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Payment Method:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.MOP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Checkout ID:</span>
                      <span className="text-sm font-medium text-gray-900 break-all">
                        {selectedOrder.paymongo_checkout_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Amount:</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900 border-b pb-2">Order Status</h5>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedOrder.IsReceived === "completed" // Changed from IsReceived to status
                          ? "bg-green-500"
                          : selectedOrder.IsReceived === "in_transit" // Changed from IsReceived to status
                          ? "bg-blue-500"
                          : selectedOrder.IsReceived === "processing" // Changed from IsReceived to status
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">
                      {getReadableStatus(selectedOrder.IsReceived)} {/* Changed from IsReceived to status */}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      Status: {selectedOrder.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h5 className="font-medium text-gray-900 border-b pb-2 mb-2">Order Items</h5>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">#</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Product ID</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Size</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Quantity</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Price</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={item.id} className="bg-white text-gray-900 hover:bg-gray-50">
                          <td className="px-4 py-2">{idx + 1}</td>
                          <td className="px-4 py-2">{item.product_id}</td>
                          <td className="px-4 py-2">{item.product?.Name}</td>
                          <td className="px-4 py-2">{item.size}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-2">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline (unchanged) */}
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900 border-b pb-2">Order Timeline</h5>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Placed</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedOrder.created_at)}</p>
                    </div>
                  </div>
                  {selectedOrder.status !== "processing" && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                        <p className="text-xs text-gray-500">Payment verified</p>
                      </div>
                    </div>
                  )}
                  {(selectedOrder.status === "in_transit" || selectedOrder.status === "completed") && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order Shipped</p>
                        <p className="text-xs text-gray-500">Package is on the way</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === "completed" && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order Delivered</p>
                        <p className="text-xs text-gray-500">Package delivered successfully</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

                <div className="border-t border-dashed border-neutral-500 my-2" />
                <ScissorsLineDashed className="text-black"/>
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Close
        </button>
        <button
          onClick={() => setShowStatusModal(true)} // Added click handler
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update Status
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Printer />
        </button>
      </div>

            </div>
          </div>
        </div>
      )}
      {/* Status Update Modal (Added) */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-60">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Update Order Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={updatingStatus}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Current Status:{" "}
                <span className="font-medium">{selectedOrder.status.replace("_", " ").toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">Select a new status for Order #{selectedOrder.OrderID}:</p>
            </div>

            <div className="space-y-3">
              {/* Processing Status Card */}
              <button
                onClick={() => handleStatusUpdate("processing")}
                disabled={updatingStatus || selectedOrder.status === "processing"}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  selectedOrder.status === "processing"
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                    : "border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Processing</h4>
                    <p className="text-xs text-gray-500">Order is being prepared</p>
                  </div>
                </div>
              </button>

              {/* In Transit Status Card */}
              <button
                onClick={() => handleStatusUpdate("in_transit")}
                disabled={updatingStatus || selectedOrder.status === "in_transit"}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  selectedOrder.status === "in_transit"
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                    : "border-blue-200 hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">In Transit</h4>
                    <p className="text-xs text-gray-500">Order is on the way</p>
                  </div>
                </div>
              </button>

              {/* Completed/Delivered Status Card */}
              <button
                onClick={() => handleStatusUpdate("completed")}
                disabled={updatingStatus || selectedOrder.status === "completed"}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  selectedOrder.status === "completed"
                    ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50"
                    : "border-green-200 hover:border-green-400 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Completed</h4>
                    <p className="text-xs text-gray-500">Order has been delivered</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Loading State */}
            {updatingStatus && (
              <div className="mt-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Updating status...</span>
              </div>
            )}

            {/* Cancel Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={updatingStatus}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}