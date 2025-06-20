"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
  Filter,
} from "lucide-react"

const API_URL = "/api/analytics"

// Helper for consistent Philippine Peso formatting
const formatCurrencyPHP = (value, shorten = false, includeDecimal = true) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '₱0.00';
  }
  if (shorten) {
    const absValue = Math.abs(Number(value));
    if (absValue >= 1_000_000) {
      return `₱${(value / 1_000_000).toFixed(includeDecimal ? 1 : 0)}M`;
    }
    if (absValue >= 1_000) {
      return `₱${(value / 1_000).toFixed(includeDecimal ? 1 : 0)}k`;
    }
    return `₱${value.toFixed(includeDecimal ? 2 : 0)}`;
  }
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: includeDecimal ? 2 : 0,
    maximumFractionDigits: includeDecimal ? 2 : 0,
  }).format(value);
};

const formatPercentage = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0%';
  }
  const numValue = Number(value);
  return `${numValue >= 0 ? '+' : ''}${numValue}%`;
};

// Format ISO date string to YYYY-MM-DD
const formatDate = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const StatCard = ({ title, value, change, icon: Icon, trend, onClick, isActive }) => (
  <div
    className={`bg-white rounded-lg shadow-sm border p-4 sm:p-6 cursor-pointer transition-all hover:shadow-md touch-manipulation${isActive ? " ring-2 ring-blue-500" : ""}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2${isActive ? " bg-blue-100" : " bg-gray-50"}`}>
        <Icon className={`h-4 w-4 sm:h-6 sm:w-6${isActive ? " text-blue-600" : " text-gray-600"}`} />
      </div>
    </div>
    {(change !== undefined && change !== null) && (
      <div className="flex items-center mt-3 sm:mt-4">
        {trend === "up" ? (
          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
        )}
        <span className={`text-xs sm:text-sm font-medium ml-1${trend === "up" ? " text-green-600" : " text-red-600"}`}>
          {formatPercentage(change)}
        </span>
        <span className="text-xs sm:text-sm text-gray-500 ml-1">vs last month</span>
      </div>
    )}
  </div>
);

const MiniChart = ({ data, activeMetric }) => {
  const maxValue = useMemo(() => {
    const values = data.map((d) => (activeMetric === "orders" ? Number(d.orders) : Number(d.sales)));
    return Math.max(...values, 0.01);
  }, [data, activeMetric]);
  const chartData = data.slice(-6);
  return (
    <div className="flex items-end space-x-1 sm:space-x-2 h-24 sm:h-32">
      {chartData.map((item, index) => {
        const value = activeMetric === "orders" ? Number(item.orders) : Number(item.sales);
        const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const displayHeight = Math.max(heightPercentage, heightPercentage > 0 ? 2 : 0);
        return (
          <div key={item.month || index} className="flex flex-col items-center flex-1">
            <div
              className="bg-blue-500 rounded-sm w-full transition-all hover:bg-blue-600 cursor-pointer min-h-[4px]"
              style={{ height: `${displayHeight}%` }}
              title={`${item.month}: ${activeMetric === "orders" ? item.orders + " orders" : formatCurrencyPHP(value, false)}`}
            />
            <span className="text-xs text-gray-500 mt-1">{item.month}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [activeMetric, setActiveMetric] = useState("revenue")
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showOrderDetails, setShowOrderDetails] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(API_URL, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            Accept: "application/json",
          },
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch analytics data")
        }
        setAnalytics(data)
      } catch (err) {
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const handleMetricClick = (metric) => setActiveMetric(metric)
  const handleOrderClick = (orderId) => setShowOrderDetails(showOrderDetails === orderId ? null : orderId)
  const handleProductClick = (productId) => console.log(`Viewing details for product ID: ${productId}`)
  const handleInventoryClick = (alertId) => console.log(`Managing inventory for alert ID: ${alertId}`)
  const handleCategoryClick = (categoryName) => setSelectedCategory(categoryName.toLowerCase())
  const handleExport = () => console.log("Exporting analytics data...")
  const handleRefresh = () => window.location.reload()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-gray-500 text-lg">Loading analytics...</span>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-red-500 text-lg">{error || "No data available."}</span>
      </div>
    )
  }

  // Parse and map API data for UI
  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalUsers = 0,
    totalProducts = 0,
    revenueGrowth = 0,
    ordersGrowth = 0,
    usersGrowth = 0,
    productsGrowth = 0,
    recentOrders = [],
    topProducts = [],
    salesChart = [],
    categoryBreakdown = [],
    inventoryAlerts = [],
  } = analytics || {};

  const parsedTotalRevenue = Number(totalRevenue)
  const parsedRecentOrders = recentOrders.map(order => ({
    ...order,
    id: order.OrderID ?? order.id,
    total: Number(order.total),
    customer: order.customer || '',
    date: order.created_at ? formatDate(order.created_at) : (order.date ? formatDate(order.date) : ''),
    created_at: order.created_at ? formatDate(order.created_at) : '',
    updated_at: order.updated_at ? formatDate(order.updated_at) : '',
  }))
  const parsedTopProducts = topProducts.map(product => ({
    ...product,
    revenue: Number(product.revenue),
    sales: Number(product.sales),
    created_at: product.created_at ? formatDate(product.created_at) : '',
    updated_at: product.updated_at ? formatDate(product.updated_at) : '',
  }))

  // Only show Apparel, Collector, Limited Edition, Accessories
  const filteredCategoryBreakdown = categoryBreakdown
    .filter(cat =>
      ["Apparel", "Collector", "Limited Edition", "Accessories"].includes(cat.name)
    );
  const totalFilteredCategorySales = filteredCategoryBreakdown.reduce((sum, cat) => sum + Number(cat.sales), 0);
  const parsedCategoryBreakdown = filteredCategoryBreakdown.map(cat => ({
    ...cat,
    sales: Number(cat.sales),
    value: totalFilteredCategorySales > 0 ? (Number(cat.sales) / totalFilteredCategorySales) * 100 : 0,
    color: cat.color || "bg-blue-500"
  }));

  const parsedSalesChart = salesChart.map(item => ({
    ...item,
    sales: Number(item.sales),
    orders: Number(item.orders),
    month: item.month || (item.date ? formatDate(item.date) : ""),
  }));

  const filteredOrders = parsedRecentOrders.filter(
    (order) =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.id && order.id.toString().includes(searchTerm))
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-3 sm:p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
         
        </div>
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <select
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="90d">90 days</option>
                <option value="1y">1 year</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
              </button>
              <button
                onClick={handleRefresh}
                className="hidden sm:flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="mt-3 p-3 bg-white rounded-lg border sm:hidden">
              <button
                onClick={handleRefresh}
                className="w-full flex items-center justify-center px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Revenue"
            value={formatCurrencyPHP(parsedTotalRevenue, true, false)}
            change={revenueGrowth}
            icon={DollarSign}
            trend={revenueGrowth >= 0 ? "up" : "down"}
            onClick={() => handleMetricClick("revenue")}
            isActive={activeMetric === "revenue"}
          />
          <StatCard
            title="Orders"
            value={totalOrders.toLocaleString()}
            change={ordersGrowth}
            icon={ShoppingCart}
            trend={ordersGrowth >= 0 ? "up" : "down"}
            onClick={() => handleMetricClick("orders")}
            isActive={activeMetric === "orders"}
          />
          <StatCard
            title="Users"
            value={totalUsers.toLocaleString()}
            change={usersGrowth}
            icon={Users}
            trend={usersGrowth >= 0 ? "up" : "down"}
            onClick={() => handleMetricClick("users")}
            isActive={activeMetric === "users"}
          />
          <StatCard
            title="Products"
            value={totalProducts.toLocaleString()}
            change={productsGrowth}
            icon={Package}
            trend={productsGrowth >= 0 ? "up" : "down"}
            onClick={() => handleMetricClick("products")}
            isActive={activeMetric === "products"}
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-0">
                {activeMetric === "orders" ? "Orders" : "Sales"} Overview
              </h3>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => setActiveMetric("sales")}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors${activeMetric === "sales" ? " bg-blue-100 text-blue-700" : " text-gray-600 hover:bg-gray-100"}`}
                >
                  Sales
                </button>
                <button
                  onClick={() => setActiveMetric("orders")}
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors${activeMetric === "orders" ? " bg-blue-100 text-blue-700" : " text-gray-600 hover:bg-gray-100"}`}
                >
                  Orders
                </button>
                <div className="hidden sm:flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {formatPercentage(revenueGrowth)}
                </div>
              </div>
            </div>
            <MiniChart data={parsedSalesChart} activeMetric={activeMetric} />
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Sales by Category</h3>
            <div className="space-y-3 sm:space-y-4">
              {parsedCategoryBreakdown.map((category, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors touch-manipulation"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-gray-600 truncate">{category.name}</span>
                    <span className="font-medium ml-2">{formatCurrencyPHP(category.sales, true, false)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${category.color} h-2 rounded-full transition-all`}
                      style={{ width: `${category.value.toFixed(2)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{category.value.toFixed(2)}% of total</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top Products</h3>
              <Link href="/products">
              <button  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700">View All</button>
              </Link>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {parsedTopProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors touch-manipulation"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {product.category} • {product.stock} stock
                      </p>
                      {product.created_at && (
                        <p className="text-xs text-gray-400">Created: {product.created_at}</p>
                      )}
                      {product.updated_at && (
                        <p className="text-xs text-gray-400">Updated: {product.updated_at}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="font-medium text-gray-900 text-sm">{formatCurrencyPHP(product.revenue, true, false)}</p>
                    <p className="text-xs text-gray-500">{product.sales} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link href="/orders">
              <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700">View All</button>
              </Link>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {filteredOrders.map((order, index) => (
                <div key={index}>
                  <div
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors touch-manipulation"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <span className="text-xs font-medium text-blue-600">#{order.id}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm truncate">{order.customer}</p>
                        <p className="text-xs text-gray-500">
                          {order.date} • {order.items} items
                        </p>
                        {order.created_at && (
                          <p className="text-xs text-gray-400">Created: {order.created_at}</p>
                        )}
                        {order.updated_at && (
                          <p className="text-xs text-gray-400">Updated: {order.updated_at}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex items-center ml-2">
                      <div className="mr-2 sm:mr-3">
                        <p className="font-medium text-gray-900 text-sm">{formatCurrencyPHP(order.total, true, true)}</p>
                        <span
                          className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full${order.status === "Completed"
                            ? " bg-green-100 text-green-800"
                            : order.status === "Paid"
                              ? " bg-blue-100 text-blue-800"
                              : " bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                  {showOrderDetails === order.id && (
                    <div className="ml-8 sm:ml-11 p-2 sm:p-3 bg-gray-50 rounded-lg text-xs sm:text-sm">
                      <p className="text-gray-600 mb-1">Order Details:</p>
                      <p className="text-gray-800">• Payment: {order.status === "Paid" ? "GCash" : "PayMaya"}</p>
                      <p className="text-gray-800">• Items: {order.items} products</p>
                      <p className="text-gray-800">• Total: {formatCurrencyPHP(order.total, false, true)}</p>
                      {order.created_at && (
                        <p className="text-gray-400">Created: {order.created_at}</p>
                      )}
                      {order.updated_at && (
                        <p className="text-gray-400">Updated: {order.updated_at}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Inventory Alerts</h3>
            <span className="text-xs sm:text-sm text-gray-500">{inventoryAlerts.length} alerts</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {inventoryAlerts.map((alert, index) => (
              <Link href="/inventory">
              <div
                key={index}
                className="flex items-center justify-between p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer transition-colors touch-manipulation"
                onClick={() => handleInventoryClick(alert.id)}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                    <Package className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{alert.product}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {alert.sku} • {alert.stock} units
                    </p>
                  </div>
                </div>
                <div className="flex items-center ml-2">
                  <span className="inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full mr-1 sm:mr-2">
                    {alert.status}
                  </span>
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}