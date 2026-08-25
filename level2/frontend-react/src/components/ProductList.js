import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import ProductForm from "./ProductForm";
import { useAuth } from "../context/AuthContext";

export default function ProductList() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSave = async (payload) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const canModify = (product) =>
    user && (user.role === "admin" || product.owner?._id === user.id);

  return (
    <div className="product-section">
      {user && (
        <ProductForm
          editingProduct={editingProduct}
          onSave={handleSave}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div key={p._id} className="product-card">
              <h3>{p.name}</h3>
              <p>
                ${p.price.toFixed(2)} &middot; Stock: {p.stock}
              </p>
              <p>{p.description}</p>
              <p className="owner-tag">Owner: {p.owner?.name || "unknown"}</p>
              {canModify(p) && (
                <div className="card-actions">
                  <button onClick={() => setEditingProduct(p)}>Edit</button>
                  <button className="danger-btn" onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
