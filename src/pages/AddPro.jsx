import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

function AddPro() {
  const { products, addProduct, categories } = useShop();
  const [formData, setFormData] = useState({
    image: "",
    images: [],
    name: "",
    description: "",
    price: "",
    stock: "",
    category: categories.length > 0 ? categories[0] : "",
    discount: "",
  });

  // Update category when categories load or change if it's empty or invalid
  React.useEffect(() => {
    if (
      categories.length > 0 &&
      (!formData.category || !categories.includes(formData.category))
    ) {
      setFormData((prev) => ({ ...prev, category: categories[0] }));
    }
  }, [categories]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images" && files) {
      const fileArray = Array.from(files);
      const imagePromises = fileArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((base64Images) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...base64Images],
          image: prev.image || base64Images[0], // Keep existing primary image if available
        }));
      });
    } else if (name === "image" && files && files[0]) {
      // Keep single image handler for backward compatibility or direct replacement
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form...", formData);

    if (!formData.name || !formData.price) {
      alert("Please fill in Name and Price at least.");
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        discount: parseFloat(formData.discount) || 0,
        stock: formData.stock ? parseInt(formData.stock) : 0, // Default to 0 if not provided
      };
      addProduct(productData);
      toast.success("Product Added Successfully!");

      // Reset Form
      setFormData({
        image: "",
        images: [],
        name: "",
        description: "",
        price: "",
        stock: "",
        stock: "",
        category: categories.length > 0 ? categories[0] : "",
        discount: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. See console.");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        Add New Product
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Images (Select Multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                name="images"
                multiple
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {formData.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Preview ${idx}`}
                    className="h-24 w-24 object-cover border rounded bg-gray-50"
                  />
                ))}
                {formData.images.length === 0 && formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-24 w-24 object-cover border rounded bg-gray-50"
                  />
                )}
              </div>
            </div>

            {/* Stock Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Available Stock
              </label>
              <input
                type="number"
                name="stock"
                placeholder="e.g. 100"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Classic T-Shirt"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the product..."
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price (EGP)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  placeholder="0"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg mt-4"
            >
              Save Product
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="w-full lg:w-1/2 bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-bold text-gray-500 mb-4">
            Latest Products Added
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {products
              .sort((a, b) => b.id - a.id)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 bg-white p-4 rounded shadow-sm items-center"
                >
                  <div className="w-20 h-20 bg-gray-200 flex-shrink-0 rounded overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-blue-600 font-bold">
                        EGP {product.price}
                      </span>
                      {product.discount && (
                        <span className="text-xs bg-red-100 text-red-600 px-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {products.length === 0 && (
              <p className="text-center text-gray-400 mt-10">
                No products yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPro;
