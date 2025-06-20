"use client"

import { useState, useEffect } from "react"
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, ChevronLeft, ChevronRight } from "lucide-react"

// Separate ViewAccountModal component
function ViewAccountModal({ account, onClose }) {
  if (!account) return null

  // Define fields to display in a nice order and with friendly labels
  const fields = [
    { label: "Account ID", value: account.id },
    { label: "First Name", value: account.FirstName },
    { label: "Middle Initial", value: account.MI },
    { label: "Last Name", value: account.LastName },
    { label: "School ID", value: account.SchoolID },
    { label: "Email", value: account.email },
    { label: "Phone Number", value: account.Phone_Number },
    { label: "Admin Privileges", value: account.IsAdmin ? "Yes" : "No" },
    { label: "Status", value: account.status },
    // Add more fields as needed
  ]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-xl font-bold text-neutral-900 mb-6 text-center">Account Details</h3>
        <div className="space-y-3">
          {fields.map(
            (field) =>
              field.value !== undefined &&
              field.value !== null && (
                <div key={field.label} className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-700">{field.label}</span>
                  <span className="text-gray-900 text-right break-all">{field.value}</span>
                </div>
              ),
          )}
        </div>
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AccountsTable() {
  const [accounts, setAccounts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [viewingAccount, setViewingAccount] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState("")
  const [form, setForm] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    schoolId: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    IsAdmin: "0",
    status: "Active",
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Fetch accounts from API and save token for testing display
  useEffect(() => {
    async function fetchAccounts() {
      const token = localStorage.getItem("jwt")
      setToken(token)
      const res = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setAccounts(
        (data.users || []).map(user => ({
          ...user,
          id: user.AccountID
        }))
      )
    }
    fetchAccounts()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "phoneNumber") {
      // Remove all non-digits
      let digits = value.replace(/\D/g, "")
      // Format as 123-456-7890
      if (digits.length > 3 && digits.length <= 6) {
        digits = digits.replace(/(\d{3})(\d+)/, "$1-$2")
      } else if (digits.length > 6) {
        digits = digits.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3")
      }
      setForm({ ...form, [name]: digits.slice(0, 12) })
    } else if (name === "IsAdmin") {
      setForm({ ...form, IsAdmin: value })
    } else {
      setForm({ ...form, [name]: value })
    }
    setErrors({ ...errors, [name]: undefined })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.firstName.trim()) newErrors.firstName = "First name is required"
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) newErrors.email = "Invalid email address"
    if (form.IsAdmin === "" || form.IsAdmin === null || typeof form.IsAdmin === "undefined")
      newErrors.IsAdmin = "Admin Priveleges field is required"
    if (!editingAccount && form.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (!editingAccount && form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (form.phoneNumber && !form.phoneNumber.match(/^\d{3}-\d{3}-\d{4}$/)) newErrors.phoneNumber = "Invalid phone number (format: 123-456-7890)"
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    const payload = {
      FirstName: form.firstName,
      LastName: form.lastName,
      MI: form.middleInitial,
      email: form.email,
      SchoolID: form.schoolId,
      Phone_Number: form.phoneNumber,
      IsAdmin: Number(form.IsAdmin),
      status: form.status,
      ...(form.password && { password: form.password }),
      // Send password_confirmation for backend validation
      ...(!editingAccount && form.password && { password_confirmation: form.confirmPassword }),
    }

    try {
      const endpoint = editingAccount
        ? `/api/update/${editingAccount.id}`
        : "/api/add/"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          editingAccount: !!editingAccount,
          token,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        if (data.errors) setErrors(data.errors)
        alert(data.message || "Failed to save account.")
        return
      }

      setAccounts(data.users || [])

      setShowModal(false)
      setEditingAccount(null)
      setForm({
        firstName: "",
        middleInitial: "",
        lastName: "",
        schoolId: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        IsAdmin: "0",
        status: "Active",
      })
      setErrors({})
    } catch (error) {
      alert("An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (account) => {
    setEditingAccount(account)
    setForm({
      firstName: account.FirstName || "",
      middleInitial: account.MI || "",
      lastName: account.LastName || "",
      schoolId: account.SchoolID || "",
      email: account.email || "",
      password: "",
      confirmPassword: "",
      phoneNumber: account.Phone_Number || "",
      IsAdmin: account.IsAdmin ? "1" : "0",
      status: account.status || "Active",
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    setAccounts(accounts.filter((account) => account.id !== id))
  }

  const openAddModal = () => {
    setEditingAccount(null)
    setForm({
      firstName: "",
      middleInitial: "",
      lastName: "",
      schoolId: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      IsAdmin: "0",
      status: "Active",
    })
    setShowModal(true)
  }

  // Pagination logic
  const totalItems = accounts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedAccounts = accounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">User Accounts</h3>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <PlusIcon className="w-4 h-4" />
          <span>Add Account</span>
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedAccounts.map((account, idx) => (
          <div
            key={account.id || idx}
            className="relative bg-gradient-to-br from-blue-50 to-white border border-white-200 rounded-xl shadow hover:shadow-lg transition-all duration-200 flex flex-col items-center p-5"
          >
            <div className="w-24 h-24 rounded-full shadow-lg bg-white flex items-center justify-center mb-4 text-4xl font-bold text-blue-900 select-none">
              {account.FirstName?.[0] || "U"}
            </div>
            <div className="w-full">
              <div className="text-center font-semibold text-lg text-neutral-900 mb-1">
                {account.FirstName} {account.LastName}
              </div>
              <div className="text-center text-xs text-gray-500 mb-2">{account.email}</div>
              {/* <div className="flex flex-col gap-1 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Account ID:</span>{" "}
                  <span className="text-gray-900">{account.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">School ID:</span>{" "}
                  <span className="text-gray-900">{account.SchoolID}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>{" "}
                  <span className="text-gray-900">{account.Phone_Number}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Admin:</span>{" "}
                  <span className="text-gray-900">{account.IsAdmin ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>{" "}
                  <span className={`font-semibold ${account.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                    {account.status}
                  </span>
                </div>
              </div> */}
            </div>
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                className="text-blue-600 hover:text-blue-900"
                onClick={() => setViewingAccount(account)}
                title="View"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEdit(account)}
                className="text-indigo-600 hover:text-indigo-900"
                title="Edit"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(account.id)}
                className="text-red-600 hover:text-red-900"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
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
              Showing <span className="font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
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
                    currentPage === i + 1
                      ? "z-10 bg-indigo-600 text-white"
                      : "text-gray-900 hover:bg-gray-50"
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
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/90 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative mx-auto p-5 my-30 border w-100 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              {editingAccount ? "Edit Account" : "Add New Account"}
            </h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      required
                    />
                    {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Middle Initial</label>
                    <input
                      type="text"
                      name="middleInitial"
                      value={form.middleInitial}
                      onChange={handleChange}
                      maxLength={2}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      required
                    />
                    {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">School ID Number</label>
                    <input
                      type="text"
                      name="schoolId"
                      value={form.schoolId}
                      onChange={handleChange}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Phone Number (+63)</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      required
                      placeholder="123-456-7890"
                    />
                    {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Email address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      required
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>
                  {!editingAccount && (
                    <>
                      <div>
                        <label className="block text-sm mb-2 text-neutral-950">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                          required
                        />
                        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-neutral-950">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                          required
                        />
                        {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Admin Priveleges</label>
                    <select
                      name="IsAdmin"
                      value={form.IsAdmin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={"0"}>No</option>
                      <option value={"1"}>Yes</option>
                    </select>
                    {errors.IsAdmin && <p className="text-xs text-red-600 mt-1">{errors.IsAdmin}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    editingAccount ? "Update" : "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Modal */}
      <ViewAccountModal account={viewingAccount} onClose={() => setViewingAccount(null)} />
    </div>
  )
}