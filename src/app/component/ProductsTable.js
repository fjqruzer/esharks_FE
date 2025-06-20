"use client";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import Image from "next/image";

export default function ProductsTable() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://snipe-enhanced-hopefully.ngrok-free.app';
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    SKU: "",
    Name: "",
    CategoryID: "",
    OriginalPrice: "",
    Price: "",
    Image: "", 
    Badge: "",
    Description: "",
    FeatureID: "",
  });
  const [file, setFile] = useState(null); 
  const [token, setToken] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const fetchProducts = async (authToken) => {
    if (!authToken) {
      console.error("No JWT token found for fetching products.");
      return;
    }
    try {
      const res = await fetch('/api/products/getProducts', {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          // "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      const result = await res.json();
      if (result.success) {
        setProducts(
          result.products.map((p) => ({
            id: p.ProductID, 
            SKU: p.SKU,
            Name: p.Name,
            CategoryID: p.CategoryID,
            OriginalPrice: p.OriginalPrice,
            Price: p.Price,
            Image: p.Image,
            Badge: p.Badge,
            Description: p.Description,
            FeatureID: p.FeatureID,
          }))
        );
      } else {
        console.error("Failed to fetch products:", result.message);
        alert(`Failed to fetch products: ${result.message}`);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("An error occurred while fetching products.");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    setToken(storedToken);
    if (storedToken) { 
      fetchProducts(storedToken);
    }
  }, []);

  const handleEdit = (product) => {
    const editingProduct = products.find((p) => p.id === product.id);
    if (!editingProduct) {
      console.error("Product not found for editing:", product);
      return;
    }
    console.log("Editing product:", editingProduct);
   
    setEditingProduct(product);
    setFormData({
      SKU: product.SKU || "",
      Name: product.Name || "",
      CategoryID: product.CategoryID || "",
      OriginalPrice: product.OriginalPrice?.toString() || "",
      Price: product.Price?.toString() || "",
      Image: product.Image || "",
      Badge: product.Badge || "",
      Description: product.Description || "",
      FeatureID: product.FeatureID || "",
    });
    setFile(null); 
    setShowModal(true);
  };

  // Open modal when delete button is clicked
  const openDeleteModal = (id) => {
    setDeleteProductId(id);
    setDeleteConfirmText("");
    setShowDeleteModal(true);
  };

  // Actual delete logic
  const handleDelete = async () => {
    if (!token) {
      alert("Authentication token is missing. Please log in.");
      setShowDeleteModal(false);
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/admin/products/delete/${deleteProductId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (result.success) {
        alert("Product deleted successfully!");
        fetchProducts(token);
      } else {
        alert(result.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
    setShowDeleteModal(false);
    setDeleteProductId(null);
    setDeleteConfirmText("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Authentication token is missing. Please log in.");
      return;
    }
  
    const form = new FormData();
    form.append('SKU', formData.SKU);
    form.append('Name', formData.Name);
    form.append('CategoryID', formData.CategoryID);
    form.append('OriginalPrice', formData.OriginalPrice);
    form.append('Price', formData.Price);
    if (file) form.append('Image', file); 
    form.append('Badge', formData.Badge);
    form.append('Description', formData.Description);
    form.append('FeatureID', formData.FeatureID);
  

    for (let pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const res = await fetch('api/products/addProduct/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
  
      const result = await res.json();
  
      if (result.success) {
        alert("Product added successfully!");
        setShowModal(false);
        setFormData({
          SKU: "", Name: "", CategoryID: "", OriginalPrice: "", Price: "",
          Image: "", Badge: "", Description: "", FeatureID: "",
        });
        setFile(null);
        fetchProducts(token);
      } else {
        alert(result.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  // --- UPDATED handleEditSubmit FUNCTION ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("[Edit] Submit triggered");
    if (!editingProduct?.id) {
      console.error("[Edit] No product selected for editing.");
      alert("Please select a product to edit.");
      return;
    }
    if (!token) {
      console.error("[Edit] No authentication token found.");
      alert("Authentication token is missing. Please log in.");
      return;
    }
  
    const dataToSend = new FormData();
    dataToSend.append("SKU", formData.SKU);
    dataToSend.append("Name", formData.Name);
    dataToSend.append("CategoryID", formData.CategoryID);
    dataToSend.append("OriginalPrice", formData.OriginalPrice.toString());
    dataToSend.append("Price", formData.Price.toString());
    dataToSend.append("Badge", formData.Badge);
    dataToSend.append("Description", formData.Description);
    dataToSend.append("FeatureID", formData.FeatureID);
  
    if (file) {
      dataToSend.append("Image", file);
      console.log("[Edit] Image file appended:", file.name);
    } else if (formData.Image === null || formData.Image === "") {
      dataToSend.append("Image", '');
      console.log("[Edit] No image file, empty string appended.");
    }
  
    // Debug: Log all FormData entries
    for (let pair of dataToSend.entries()) {
      console.log(`[Edit] FormData: ${pair[0]} =`, pair[1]);
    }
  
    try {
      const url = `https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/products/update/${editingProduct.id}`;
      console.log(`[Edit] Sending PUT directly to Laravel: ${url}`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type for FormData
        },
        body: dataToSend,
      });
  
      console.log("[Edit] Response status:", response.status);
  
      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
        console.log("[Edit] JSON response:", result);
      } else {
        result = await response.text();
        console.log("[Edit] Text response:", result);
      }
  
      if (!response.ok) {
        console.error("[Edit] Update failed:", result);
        alert(result?.message || "Failed to update product.");
        return;
      }
  
      alert("Product updated successfully!");
      setShowModal(false);
      setEditingProduct(null);
      setFile(null);
      setFormData({
        SKU: "", Name: "", CategoryID: "", OriginalPrice: "", Price: "",
        Image: "", Badge: "", Description: "", FeatureID: "",
      });
      fetchProducts(token);
    } catch (error) {
      alert("An error occurred while updating the product.");
      console.error("[Edit] Exception:", error);
    }
  };
  // --- END UPDATED handleEditSubmit FUNCTION ---

  const openAddModal = () => {
    setEditingProduct(null); // Clear editingProduct for add mode
    setFormData({
      SKU: "", Name: "", CategoryID: "", OriginalPrice: "", Price: "",
      Image: "", Badge: "", Description: "", FeatureID: "",
    });
    setFile(null); // Clear any selected file
    setShowModal(true);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Product Inventory</h3>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <PlusIcon className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>
      <div className="px-6 py-2">
        <div className="text-xs text-gray-500 mb-2">JWT Token (for testing):</div>
        <div className="break-all text-xs bg-gray-900 p-2 rounded text-white">{token || "No token found"}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FeatureID</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.SKU}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.Name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.CategoryID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.OriginalPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.Price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.Image ? (
                    <Image
                      src={`https://snipe-enhanced-hopefully.ngrok-free.app/storage/${product.Image}`}
                      alt={product.Name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                      unoptimized
                    />
                  ) : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.Badge}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate overflow-hidden">
                {product.Description}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.FeatureID}</td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(product.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/90 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative mx-auto p-5 border md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white my-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            {/* The onSubmit handler is crucial here */}
            <form onSubmit={editingProduct ? handleEditSubmit : handleAdd}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left Column: Image Preview */}
                <div className="w-full md:w-1/3 lg:w-1/4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Image Preview
                  </label>
                    {(formData.Image || file) && (
                  <div className="relative w-full pb-[100%]">
                    <Image
                      src={
                        file
                          ? URL.createObjectURL(file) // Show selected file preview in add mode
                          : `https://snipe-enhanced-hopefully.ngrok-free.app/storage/${formData.Image}` // Show existing image in edit mode
                      }
                      alt="Product Preview"
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                    />
                  </div>
                )}
                  {/* Image Upload Field - Grouped with preview */}
                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Upload Image
                    </label>
                      <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const fileObj = e.target.files?.[0];
                        setFile(fileObj || null);
                        if (fileObj) {
                          setFormData({ ...formData, Image: fileObj.name });
                        } else {
                          setFormData({ ...formData, Image: "" });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Right Column: Other Fields */}
                <div className="w-full md:w-2/3 lg:w-3/4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={formData.SKU}
                        onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.Name}
                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Category ID
                      </label>
                      <input
                        type="text"
                        value={formData.CategoryID}
                        onChange={(e) => setFormData({ ...formData, CategoryID: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Original Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.OriginalPrice}
                        onChange={(e) => setFormData({ ...formData, OriginalPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.Price}
                        onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Badge
                      </label>
                          <select
                          value={formData.Badge}
                          onChange={(e) => setFormData({ ...formData, Badge: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                          <option value="">-- None --</option>
                          <option value="NEW">NEW</option>
                          <option value="LIMITED EDITION">LIMITED EDITION</option>
                          <option value="SALE">SALE</option>
                          <option value="SPECIAL OFFER">SPECIAL OFFER</option>
                        </select>
                    </div>
                    {/* <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Feature ID
                      </label>
                      <input
                        type="text"
                        value={formData.FeatureID}
                        onChange={(e) => setFormData({ ...formData, FeatureID: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Description Field (Full Width, below the columns) */}
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.Description}
                  onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                  className="w-full px-3 py-2 h-25 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit" // This button will trigger the form's onSubmit
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-neutral-900/90 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Delete Product</h2>
            <p className="mb-4 text-gray-700">
              To confirm deletion, type <span className="font-mono font-bold text-red-600">delete</span> below.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Type delete to confirm"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={deleteConfirmText.trim().toLowerCase() !== "delete"}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}