import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

function ManageCategories() {
  const { categories, addCategory, deleteCategory, editCategory } = useShop();
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempCategoryName, setTempCategoryName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists");
      return;
    }
    addCategory(newCategory.trim());
    setNewCategory("");
    toast.success("Category added");
  };

  const handleEditStart = (category) => {
    setEditingCategory(category);
    setTempCategoryName(category);
  };

  const handleEditSave = () => {
    if (!tempCategoryName.trim()) return;
    if (
      tempCategoryName.trim() !== editingCategory &&
      categories.includes(tempCategoryName.trim())
    ) {
      toast.error("Category name already taken");
      return;
    }
    editCategory(editingCategory, tempCategoryName.trim());
    setEditingCategory(null);
    setTempCategoryName("");
    toast.success("Category updated");
  };

  const handleDelete = (category) => {
    if (window.confirm(`Are you sure you want to delete "${category}"?`)) {
      deleteCategory(category);
      toast.success("Category deleted");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>

      {/* Add Category */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-2">Add New Category</h3>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category Name"
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
          >
            Add
          </button>
        </form>
      </div>

      {/* List Categories */}
      <div className="bg-white rounded shadow text-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Category Name</th>
              <th className="p-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {editingCategory === category ? (
                    <input
                      type="text"
                      value={tempCategoryName}
                      onChange={(e) => setTempCategoryName(e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    <span className="font-medium">{category}</span>
                  )}
                </td>
                <td className="p-3 flex items-center gap-2">
                  {editingCategory === category ? (
                    <>
                      <button
                        onClick={handleEditSave}
                        className="text-yellow-600 hover:text-yellow-800 font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditStart(category)}
                        className="text-yellow-600 hover:text-yellow-800 bg-yellow-50 px-3 py-1 rounded border border-yellow-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded border border-red-200"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="2" className="p-8 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCategories;
