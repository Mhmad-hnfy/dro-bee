import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

function ManageProducts() {
  const { products, deleteProduct, editProduct, categories } = useShop();
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editProduct) {
      toast.error("Edit function not found");
      return;
    }
    editProduct(editingProduct);
    setEditingProduct(null);
    toast.success("Product Updated");
  };

  const handleEditImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Products</h2>

      {/* Edit Dialog - Manual Modal for simplicity */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500">Product Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const fileArray = Array.from(e.target.files);
                      const promises = fileArray.map(
                        (file) =>
                          new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(file);
                          }),
                      );
                      Promise.all(promises).then((res) => {
                        setEditingProduct((prev) => ({
                          ...prev,
                          images: [...(prev.images || []), ...res],
                          image: prev.image || res[0],
                        }));
                      });
                    }
                  }}
                  className="border border-gray-300 p-2 rounded-md w-full"
                />
                <div className="flex gap-2 mt-2 overflow-x-auto p-1">
                  {/* Show primary image first if no images array, or iterate images array */}
                  {(editingProduct.images && editingProduct.images.length > 0
                    ? editingProduct.images
                    : [editingProduct.image]
                  )
                    .filter(Boolean)
                    .map((img, idx) => (
                      <div key={idx} className="relative flex-shrink-0 group">
                        <img
                          src={img}
                          className="w-16 h-16 object-cover border rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = editingProduct.images
                              ? editingProduct.images.filter(
                                  (_, i) => i !== idx,
                                )
                              : [];
                            setEditingProduct({
                              ...editingProduct,
                              images: newImages,
                              image: newImages.length > 0 ? newImages[0] : "",
                            });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="text-xs text-gray-500">Category</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                      })
                    }
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="text-xs text-gray-500">Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Description</label>
                <textarea
                  placeholder="Description"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="text-xs text-gray-500">Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-xs text-gray-500">Discount%</label>
                  <input
                    type="number"
                    placeholder="Discount"
                    value={editingProduct.discount}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        discount: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-xs text-gray-500">Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={editingProduct.stock || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow text-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={product.id || idx} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">EGP {product.price}</td>
                <td className="p-3 flex items-center">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-yellow-600 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded mr-2 transition-colors font-medium text-xs border border-yellow-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this product?")) {
                        deleteProduct(product.id);
                        toast.success("Product deleted");
                      }
                    }}
                    className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors font-medium text-xs border border-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No products found. Go to "Add Product" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageProducts;
