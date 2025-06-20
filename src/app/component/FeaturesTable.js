"use client";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";

export default function FeaturesTable() {
  const [features, setFeatures] = useState([]);
  const [products, setProducts] = useState([]); // <-- Add this line
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    Description: "",
    ProductID: "",
  });
  const [token, setToken] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://snipe-enhanced-hopefully.ngrok-free.app';

  // Fetch products for dropdown
  const fetchProducts = async (authToken) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/products/getProducts`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
        cache: "no-store",
      });
      const result = await res.json();
      if (result.success) {
        setProducts(
        result.products.map((p) => ({
            id: p.ProductID,
            Name: p.Name,
        }))
        );
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    }
  };

  // --- Fetch Features ---
  const fetchFeatures = async (authToken) => {
    if (!authToken) {
      console.error("No JWT token found for fetching features.");
      return;
    }
    try {
      const res = await fetch(`/api/features/getFeatures`, { // Adjusted API endpoint
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      const result = await res.json();
      if (result.success) {
        setFeatures(
          result.features.map((f) => ({ // Assuming your API returns 'features' array
            id: f.FeatureID, // Map FeatureID to 'id'
            ProductID: f.ProductID,
            Description: f.Description,
          }))
        );
      } else {
        console.error("Failed to fetch features:", result.message);
        alert(`Failed to fetch features: ${result.message}`);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
      alert("An error occurred while fetching features.");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    setToken(storedToken);
    if (storedToken) {
      fetchFeatures(storedToken);
      fetchProducts(storedToken); // <-- Fetch products for dropdown
    }
  }, []);

  // --- Handle Edit (Populate Modal) ---
  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setFormData({
      Description: feature.Description || "",
      ProductID: feature.ProductID || "",
    });
    setShowModal(true);
  };

  // --- Handle Delete ---
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this feature?")) {
      return;
    }
    if (!token) {
      alert("Authentication token is missing. Please log in.");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/admin/features/delete/${id}`, { // Adjusted API endpoint
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (result.success) {
        alert("Feature deleted successfully!");
        fetchFeatures(token); // Re-fetch features
      } else {
        alert(result.message || "Failed to delete feature.");
      }
    } catch (error) {
      console.error("Error deleting feature:", error);
      alert("An error occurred while deleting the feature.");
    }
  };

  // --- Handle Add New Feature ---
 const handleAdd = async (e) => {
  e.preventDefault();
  if (!token) {
    alert("Authentication token is missing. Please log in.");
    return;
  }

  const form = new FormData();
  form.append("ProductID", formData.ProductID);
  form.append("Description", formData.Description);

  try {
    const res = await fetch(`/api/features/addFeature`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        // Do NOT set Content-Type for FormData!
      },
      body: form,
    });

    const result = await res.json();

    if (result.success) {
      alert("Feature added successfully!");
      setShowModal(false);
      setFormData({ ProductID: "", Description: "" });
      fetchFeatures(token);
    } else {
      alert(result.message || "Failed to add feature.");
    }
  } catch (error) {
    console.error("Error adding feature:", error);
    alert("An error occurred while adding the feature.");
  }
};

  // --- Handle Edit Submit ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingFeature?.id) {
      alert("Please select a feature to edit.");
      return;
    }
    if (!token) {
      alert("Authentication token is missing. Please log in.");
      return;
    }

    const dataToSend = { // Sending JSON for simpler data
        FeatureID: editingFeature.id, // Include FeatureID for update
        ProductID: formData.ProductID,
        Description: formData.Description,
    };
  
    try {
      const url = `${apiUrl}/api/admin/features/update/${editingFeature.id}`; // Adjusted API endpoint
      const response = await fetch(url, {
        method: "PUT", // Use PUT for updates if your API supports it, otherwise POST
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send as JSON string
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error("Update failed:", result);
        alert(result?.message || "Failed to update feature.");
        return;
      }
  
      alert("Feature updated successfully!");
      setShowModal(false);
      setEditingFeature(null);
      setFormData({ ProductID: "", Description: "" }); // Reset form
      fetchFeatures(token);
    } catch (error) {
      alert("An error occurred while updating the feature.");
      console.error("Exception:", error);
    }
  };

  // --- Open Add Modal ---
  const openAddModal = () => {
    setEditingFeature(null);
    setFormData({ ProductID: "", Description: "" });
    setShowModal(true);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Product Features</h3>
        <button
          onClick={openAddModal}
          className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <PlusIcon className="w-4 h-4" />
          <span>Add New Feature</span>
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
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature ID</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3"></th> {/* Actions column */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {features.map((feature) => ( // Iterate over features
              <tr key={feature.id} className="hover:bg-gray-50">
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feature.id}</td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feature.ProductID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate overflow-hidden">
                  {feature.Description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                  <button
                    onClick={() => handleEdit(feature)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(feature.id)}
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
          <div className="relative mx-auto p-5 border md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white my-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingFeature ? "Edit Feature" : "Add New Feature"}
            </h3>
            <form onSubmit={editingFeature ? handleEditSubmit : handleAdd}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Product
                  </label>
                  <select
                    value={formData.ProductID}
                    onChange={(e) => setFormData({ ...formData, ProductID: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                    className="w-full px-3 py-2 h-25 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingFeature ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}