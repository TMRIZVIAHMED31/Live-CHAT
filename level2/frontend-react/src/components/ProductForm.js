import { useState, useEffect } from "react";

export default function ProductForm({ editingProduct, onSave, onCancel }) {
  const [form, setForm] = useState({ name: "", price: "", stock: "", description: "" });

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        price: editingProduct.price,
        stock: editingProduct.stock,
        description: editingProduct.description || "",
      });
    } else {
      setForm({ name: "", price: "", stock: "", description: "" });
    }
  }, [editingProduct]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock || "0", 10),
      description: form.description,
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
      <input
        name="name"
        placeholder="Product name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        type="number"
        step="0.01"
        min="0"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />
      <input
        name="stock"
        type="number"
        min="0"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        rows={2}
        value={form.description}
        onChange={handleChange}
      />
      <div className="form-actions">
        <button type="submit">{editingProduct ? "Update" : "Add"}</button>
        {editingProduct && (
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
