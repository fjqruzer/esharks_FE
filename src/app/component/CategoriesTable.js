"use client";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import Image from "next/image";

export default function CategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Image: "",
  });
  const [file, setFile] = useState(null);
  const [token, setToken] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://snipe-enhanced-hopefully.ngrok-free.app';

  const fetchCategories = async (authToken) => {
    if (!authToken) {
      console.error("No JWT token found for fetching categories.");
      return;
    }
    try {
      const res = await fetch(`/api/category/getCategory`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      const result = await res.json();
      if (result.success) {
        setCategories(
          result.categories.map((c) => ({
            id: c.CategoryID,
            Name: c.Name,
            Description: c.Description,
            Image: c.Image,
          }))
        );
      } else {
        console.error("Failed to fetch categories:", result.message);
        alert(`Failed to fetch categories: ${result.message}`);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("An error occurred while fetching categories.");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    setToken(storedToken);
    if (storedToken) {
      fetchCategories(storedToken);
    }
  }, []);

  const handleEdit = (category) => {
    const editingCategoryData = categories.find((c) => c.id === category.id);
    if (!editingCategoryData) {
      console.error("Category not found for editing:", category);
      return;
    }
    setEditingCategory(category);
    setFormData({
      Name: category.Name || "",
      Description: category.Description || "",
      Image: category.Image || "",
    });
    setFile(null);
    setShowModal(true);
  };

  const openDeleteModal = (id) => {
    setDeleteCategoryId(id);
    setDeleteConfirmText("");
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!token) {
      alert("Authentication token is missing. Please log in.");
      setShowDeleteModal(false);
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/admin/category/delete/${deleteCategoryId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (result.success) {
        alert("Category deleted successfully!");
        fetchCategories(token);
      } else {
        alert(result.message || "Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    }
    setShowDeleteModal(false);
    setDeleteCategoryId(null);
    setDeleteConfirmText("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Authentication token is missing. Please log in.");
      return;
    }

    const form = new FormData();
    form.append('Name', formData.Name);
    form.append('Description', formData.Description);
    if (file) form.append('Image', file);

    try {
      const res = await fetch(`/api/category/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();

      if (result.success) {
        alert("Category added successfully!");
        setShowModal(false);
        setFormData({ Name: "", Description: "", Image: "" });
        setFile(null);
        fetchCategories(token);
      } else {
        alert(result.message || "Failed to add category.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("An error occurred while adding the category.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory?.id) {
      alert("Please select a category to edit.");
      return;
    }
    if (!token) {
      alert("Authentication token is missing. Please log in.");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("Name", formData.Name);
    dataToSend.append("Description", formData.Description);
    if (file) {
      dataToSend.append("Image", file);
    } else if (formData.Image === null || formData.Image === "") {
      dataToSend.append("Image", '');
    }

    try {
      const url = `https://snipe-enhanced-hopefully.ngrok-free.app/api/admin/category/update/${editingCategory.id}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (!response.ok) {
        console.error("Update failed:", result);
        alert(result?.message || "Failed to update category.");
        return;
      }

      alert("Category updated successfully!");
      setShowModal(false);
      setEditingCategory(null);
      setFile(null);
      setFormData({ Name: "", Description: "", Image: "" });
      fetchCategories(token);
    } catch (error) {
      alert("An error occurred while updating the category.");
      console.error("Exception:", error);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ Name: "", Description: "", Image: "" });
    setFile(null);
    setShowModal(true);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Available Categories</h3>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <PlusIcon className="w-4 h-4" />
          <span>Add New Category</span>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.Name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.Description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {c.Image ? (
                    <Image
                      src={`https://snipe-enhanced-hopefully.ngrok-free.app/storage/${c.Image}`}
                      alt={c.Name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                      unoptimized
                    />
                  ) : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(c.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/90 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative mx-auto p-5 border md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white my-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={editingCategory ? handleEditSubmit : handleAdd}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3 lg:w-1/4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Image Preview
                  </label>
                  {(formData.Image || file) && (
                    <div className="relative w-full pb-[100%]">
                      <Image
                        src={
                          file
                            ? URL.createObjectURL(file)
                            : `https://snipe-enhanced-hopefully.ngrok-free.app/storage/${formData.Image}`
                        }
                        alt="Category Preview"
                        fill
                        className="object-cover rounded-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                      />
                    </div>
                  )}
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

                <div className="w-full md:w-2/3 lg:w-3/4">
                  <div className="grid grid-cols-1 gap-4">
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
                        Description
                      </label>
                      <textarea
                        value={formData.Description}
                        onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                        className="w-full px-3 py-2 h-25 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={2}
                      />
                    </div>
                  </div>
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
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Delete Category</h2>
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