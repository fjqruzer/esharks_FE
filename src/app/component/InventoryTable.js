"use client";

import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function InventoryTable() {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [form, setForm] = useState({
    InventoryID: "",
    ProductID: "",
    SKU: "",
    Name: "",
    Size: "",
    Quantity_In_Stock: "",
    IsAvailable: true,
    imageUrl: "",
  });
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState(""); // For filtering
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("jwt");
      setToken(token);
      try {
        const [invRes, prodRes] = await Promise.all([
          fetch("/api/inventory/getInventory", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/products/getProducts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!invRes.ok) {
          throw new Error(`Error fetching inventory: ${invRes.statusText}`);
        }
        if (!prodRes.ok) {
          throw new Error(`Error fetching products: ${prodRes.statusText}`);
        }

        const invData = await invRes.json();
        const prodData = await prodRes.json();

        let productsArr = [];
        if (Array.isArray(prodData)) {
          productsArr = prodData;
        } else if (Array.isArray(prodData.items)) {
          productsArr = prodData.items;
        } else if (Array.isArray(prodData.products)) {
          productsArr = prodData.products;
        } else {
          console.error("Products API did not return an array or items/products array:", prodData);
          alert("Products API did not return products data. Check your backend.");
          return;
        }

        setInventory(
          (invData.items || []).map((item) => {
            const itemProductID = Number(item.ProductID);
            const product = productsArr.find(
              (p) => Number(p.ProductID) === itemProductID
            );

            let finalImageUrl = `https://via.placeholder.com/150/cccccc/000000?text=NO+IMG`;
            if (product && product.Image) {
              finalImageUrl = `https://snipe-enhanced-hopefully.ngrok-free.app/storage/${product.Image}`;
            }

            return {
              ...item,
              id: item.InventoryID,
              imageUrl: finalImageUrl,
              IsAvailable: item.IsAvailable === 1 || item.IsAvailable === true,
            };
          })
        );
        setProducts(productsArr);
      } catch (error) {
        console.error("Failed to fetch inventory or products:", error);
        alert(`Failed to load inventory: ${error.message}. Please try again.`);
      }
    }
    fetchData();
  }, []);

  // Filtering logic
  const filteredInventory = inventory.filter(item => {
    if (!filter.trim()) return true;
    const search = filter.trim().toLowerCase();
    return (
      (item.Name && item.Name.toLowerCase().includes(search)) ||
      (item.SKU && item.SKU.toLowerCase().includes(search)) ||
      (item.Size && String(item.Size).toLowerCase().includes(search)) ||
      (item.ProductID && String(item.ProductID).toLowerCase().includes(search))
    );
  });

  // Pagination logic
  const totalItems = filteredInventory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Quantity_In_Stock") {
      const parsedValue = parseInt(value, 10);
      setForm({ ...form, [name]: isNaN(parsedValue) || parsedValue < 0 ? "" : parsedValue });
    } else {
      setForm({ ...form, [name]: value === null || value === undefined ? "" : String(value) });
    }
    setErrors({ ...errors, [name]: undefined });
  };

  const handleToggleAvailability = () => {
    setForm((prevForm) => ({
      ...prevForm,
      IsAvailable: !prevForm.IsAvailable,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.ProductID.trim()) newErrors.ProductID = "Product ID is required.";
    if (!form.SKU.trim()) newErrors.SKU = "SKU is required.";
    if (!form.Name.trim()) newErrors.Name = "Product Name is required.";
    // if (!form.Size.trim()) newErrors.Size = "Size is required.";
    if (
      form.Quantity_In_Stock === "" ||
      form.Quantity_In_Stock === null ||
      isNaN(form.Quantity_In_Stock) ||
      form.Quantity_In_Stock < 0
    ) {
      newErrors.Quantity_In_Stock = "Quantity in stock must be a non-negative number.";
    }
    return newErrors;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validate();
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  setLoading(true);

  try {
    let endpoint, method;
    if (editingItem && form.InventoryID) {
      endpoint = `/api/inventory/update/${form.InventoryID}`;
      method = "POST"; // or "PATCH" if your backend expects PATCH for update
    } else {
      endpoint = `/api/inventory/addInventory/`;
      method = "POST";
    }

    const formData = new FormData();
    formData.append("InventoryID", form.InventoryID);
    formData.append("ProductID", form.ProductID);
    formData.append("SKU", form.SKU);
    formData.append("Name", form.Name);
    formData.append("Size", form.Size);
    formData.append("Quantity_In_Stock", String(form.Quantity_In_Stock));
    formData.append("IsAvailable", form.IsAvailable ? "1" : "0");
    // formData.append("imageUrl", form.imageUrl);

    const res = await fetch(endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type for FormData!
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      if (data.errors) setErrors(data.errors);
      alert(data.message || "Failed to save inventory item.");
      return;
    }

    setShowModal(false);
    setEditingItem(null);
    setForm({
      InventoryID: "",
      ProductID: "",
      SKU: "",
      Name: "",
      Size: "",
      Quantity_In_Stock: "",
      IsAvailable: true,
      imageUrl: "",
    });
    setErrors({});
  } catch (error) {
    console.error("Error saving inventory item:", error);
    alert("An error occurred while saving the item.");
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      InventoryID: item.InventoryID !== undefined && item.InventoryID !== null ? String(item.InventoryID) : "",
      ProductID: item.ProductID !== undefined && item.ProductID !== null ? String(item.ProductID) : "",
      SKU: item.SKU !== undefined && item.SKU !== null ? String(item.SKU) : "",
      Name: item.Name !== undefined && item.Name !== null ? String(item.Name) : "",
      Size: item.Size !== undefined && item.Size !== null ? String(item.Size) : "",
      Quantity_In_Stock: item.Quantity_In_Stock,
      IsAvailable: item.IsAvailable,
      imageUrl: item.imageUrl !== undefined && item.imageUrl !== null ? String(item.imageUrl) : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;

    try {
      const res = await fetch(`/api/inventory/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete inventory item.");
        return;
      }

      setInventory(inventory.filter((item) => item.id !== id));
      alert("Inventory item deleted successfully!");
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      alert("An error occurred while deleting the item.");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      InventoryID: "",
      ProductID: "",
      SKU: "",
      Name: "",
      Size: "",
      Quantity_In_Stock: "",
      IsAvailable: true,
      imageUrl: "",
    });
    setErrors({});
    setShowModal(true);
  };

const handleItemToggle = async (id, currentValue) => {
  const newValue = !currentValue;
  try {
    setInventory((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, IsAvailable: newValue } : inv
      )
    );
    const res = await fetch(
      `https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/inventory/${id}/toggle`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ IsAvailable: newValue ? 1 : 0 }),
      }
    );
    if (!res.ok) throw new Error("Failed to update availability");
  } catch (err) {
    alert("Failed to update availability");
    setInventory((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, IsAvailable: currentValue } : inv
      )
    );
  }
};
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Current Inventory</h3>
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
          <input
            type="text"
            placeholder="Search by name, SKU, size, or product ID"
            value={filter}
            onChange={e => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openAddModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {paginatedInventory.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">No inventory found.</div>
        ) : (
          paginatedInventory.map((item) => (
            <div key={item.id} className="bg-neutral-100 border border-gray-200 rounded-xl shadow overflow-hidden flex flex-col">
              <div className="grid grid-cols-12 gap-4 p-4">
                <div className="col-span-4 flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.Name || "Product image"}
                    className="w-full h-auto max-h-40 object-contain rounded-md"
                  />
                </div>

                <div className="col-span-8 flex flex-col justify-between">
                  <div className="grid grid-cols-1 gap-1 mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate text-end">
                      <span className="font-bold text-gray-500 ">INV-ID:</span> {item.InventoryID}
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      <span className="font-bold text-gray-500">PROD. ID:</span> {item.ProductID}
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      <span className="font-semibold text-gray-500">SKU:</span> {item.SKU}
                    </p>
                    <h4 className="text-md font-bold text-neutral-800 line-clamp-2">{item.Name}</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm mb-2">
                    <div>
                      <span className="font-semibold text-gray-500">Stock:</span>{" "}
                      <span className="text-gray-700">{item.Quantity_In_Stock}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">ON SALE:</span>{" "}
                      <label className="inline-flex items-center cursor-pointer">
                        <br />
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.IsAvailable}
                          onChange={() => handleItemToggle(item.id, item.IsAvailable)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          {item.IsAvailable ? "YES" : "NO"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm mb-4">
                    <div>
                      <span className="font-semibold text-gray-500">Size:</span>{" "}
                      <span className="text-slate-700 text-lg font-bold">{item.Size}</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900" title="View Details">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit Item"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Item"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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

      {/* ...modal code remains unchanged... */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative mx-auto p-5 border w-full m-10 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
            </h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {editingItem && (
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">Inventory ID</label>
                      <input
                        type="text"
                        name="InventoryID"
                        value={form.InventoryID}
                        readOnly
                        className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-gray-500 bg-gray-100"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Product</label>
                    <select
                      name="ProductID"
                      value={form.ProductID}
                      onChange={e => {
                        const selectedProduct = products.find(
                          p => String(p.ProductID) === e.target.value
                        );
                        setForm(form => ({
                          ...form,
                          ProductID: e.target.value,
                          Name: selectedProduct ? selectedProduct.Name : "",
                          SKU: selectedProduct ? selectedProduct.SKU || "" : "",
                          // Add more fields if needed
                        }));
                      }}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option key={product.ProductID} value={product.ProductID}>
                          {product.Name} ({product.ProductID})
                        </option>
                      ))}
                    </select>
                    {errors.ProductID && <p className="text-xs text-red-600 mt-1">{errors.ProductID}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">SKU</label>
                    <input
                      type="text"
                      name="SKU"
                      value={form.SKU}
                      onChange={handleChange}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      required
                      placeholder="e.g., TSHIRT001-RED-M"
                    />
                    {errors.SKU && <p className="text-xs text-red-600 mt-1">{errors.SKU}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Product Name</label>
                    <input
                      type="text"
                      name="Name"
                      value={form.Name}
                      onChange={handleChange}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      required
                      placeholder="e.g., Classic Cotton T-Shirt"
                    />
                    {errors.Name && <p className="text-xs text-red-600 mt-1">{errors.Name}</p>}
                  </div>
                  {/* <div>
                    <label className="block text-sm mb-2 text-gray-700">Image URL</label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      placeholder="e.g., http://example.com/image.jpg"
                    />
                  </div> */}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Size</label>
                    <select
                      name="Size"
                      value={form.Size}
                      onChange={handleChange}
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      
                    >
                      <option value="">Select size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                    {errors.Size && <p className="text-xs text-red-600 mt-1">{errors.Size}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Quantity In Stock</label>
                    <input
                      type="number"
                      name="Quantity_In_Stock"
                      value={form.Quantity_In_Stock}
                      onChange={handleChange}
                      min="0"
                      className="py-2.5 sm:py-3 px-4 block w-full sm:text-sm border-gray-400 border-b-2 focus:border-blue-500 focus:ring-blue-500 focus:border-b-0 text-neutral-950"
                      required
                    />
                    {errors.Quantity_In_Stock && <p className="text-xs text-red-600 mt-1">{errors.Quantity_In_Stock}</p>}
                  </div>
                       <div>
                    <label className="block text-sm mb-2 text-gray-700">Is Available</label>
                    <label className="inline-flex items-center cursor-pointer ml-2">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={form.IsAvailable}
                        onChange={handleToggleAvailability}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {form.IsAvailable ? "YES" : "NO"}
                      </span>
                    </label>
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
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : editingItem ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}