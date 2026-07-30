import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ id: 0, name: '', description: '' });
  const [productForm, setProductForm] = useState({
    id: 0,
    categoryId: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imagePath: '',
    isActive: true,
  });
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState(false);
  const [error, setError] = useState('');
  const [confirmCreateCategory, setConfirmCreateCategory] = useState(false);
  const [confirmUpdateCategory, setConfirmUpdateCategory] = useState(false);
  const [confirmCreateProduct, setConfirmCreateProduct] = useState(false);
  const [confirmUpdateProduct, setConfirmUpdateProduct] = useState(false);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(false);
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(0);
  const [deleteProductId, setDeleteProductId] = useState(0);

  const loadData = async () => {
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        api.get('/categories'),
        api.get('/products/all'),
      ]);
      setCategories(categoriesResponse.data);
      setProducts(productsResponse.data);
    } catch {
      setError('Failed to load admin data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCategoryChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm({
      ...productForm,
      [name]:
        name === 'price' || name === 'stock' || name === 'categoryId'
          ? Number(value)
          : value,
    });
  };

  const submitCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      setError('Category name is required');
      return;
    }
    if (editingCategory) {
      setConfirmUpdateCategory(true);
    } else {
      setConfirmCreateCategory(true);
    }
  };

  const createCategory = async () => {
    setConfirmCreateCategory(false);
    try {
      await api.post('/categories', categoryForm);
      setCategoryForm({ id: 0, name: '', description: '' });
      loadData();
    } catch {
      setError('Category operation failed');
    }
  };

  const updateCategory = async () => {
    setConfirmUpdateCategory(false);
    try {
      await api.put(`/categories/${categoryForm.id}`, categoryForm);
      setCategoryForm({ id: 0, name: '', description: '' });
      setEditingCategory(false);
      loadData();
    } catch {
      setError('Category operation failed');
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (editingProduct) {
      setConfirmUpdateProduct(true);
    } else {
      setConfirmCreateProduct(true);
    }
  };

  const createProduct = async () => {
    setConfirmCreateProduct(false);
    try {
      await api.post('/products', productForm);
      setProductForm({
        id: 0,
        categoryId: 0,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imagePath: '',
        isActive: true,
      });
      loadData();
    } catch {
      setError('Product operation failed');
    }
  };

  const updateProduct = async () => {
    setConfirmUpdateProduct(false);
    try {
      await api.put(`/products/${productForm.id}`, productForm);
      setProductForm({
        id: 0,
        categoryId: 0,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imagePath: '',
        isActive: true,
      });
      setEditingProduct(false);
      loadData();
    } catch {
      setError('Product operation failed');
    }
  };

  const deleteCategory = async () => {
    setConfirmDeleteCategory(false);
    try {
      await api.delete(`/categories/${deleteCategoryId}`);
      setDeleteCategoryId(0);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Category operation failed');
    }
  };

  const deleteProduct = async () => {
    setConfirmDeleteProduct(false);
    try {
      await api.delete(`/products/${deleteProductId}`);
      setDeleteProductId(0);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Product operation failed');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <p className="mb-4">
        Do you want see the orders?{' '}
        <Link
          to="/admin/orders"
          style={{ color: '#BDD9D7', textDecoration: 'underline' }}
        >
          Click here to navigate to the orders page.
        </Link>
      </p>

      <h3 className="mt-4">Categories CRUD</h3>
      <form onSubmit={submitCategory} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          className="form-control mb-2"
          value={categoryForm.name}
          onChange={handleCategoryChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="form-control mb-2"
          value={categoryForm.description}
          onChange={handleCategoryChange}
        />
        <button className={`btn ${editingCategory ? 'btn-warning' : 'btn-primary'}`}>
          {editingCategory ? 'Update Category' : 'Create Category'}
        </button>
      </form>

      {confirmCreateCategory && (
        <div className="alert alert-secondary mb-4">
          <p>Are you sure you want to create this category?</p>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setConfirmCreateCategory(false)}
          >
            No
          </button>
          <button className="btn btn-success" onClick={createCategory}>
            Yes
          </button>
        </div>
      )}

      {confirmUpdateCategory && (
        <div className="alert alert-secondary mb-4">
          <p>Are you sure you want to update this category?</p>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setConfirmUpdateCategory(false)}
          >
            No
          </button>
          <button className="btn btn-success" onClick={updateCategory}>
            Yes
          </button>
        </div>
      )}

      <table className="table table-bordered mb-5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <div className="d-flex flex-nowrap">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setCategoryForm(category);
                      setEditingCategory(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setDeleteCategoryId(category.id);
                      setConfirmDeleteCategory(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDeleteCategory && (
        <div className="alert alert-secondary mb-3">
          <p>Are you sure you want to delete this category?</p>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setConfirmDeleteCategory(false)}
          >
            No
          </button>
          <button className="btn btn-success" onClick={deleteCategory}>
            Yes
          </button>
        </div>
      )}

      <h3>Products CRUD</h3>
      <form onSubmit={submitProduct} className="mb-4">
        <select
          name="categoryId"
          className="form-control mb-2"
          value={productForm.categoryId}
          onChange={handleProductChange}
        >
          <option value={0}>Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          className="form-control mb-2"
          value={productForm.name}
          onChange={handleProductChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="form-control mb-2"
          value={productForm.description}
          onChange={handleProductChange}
        />
        <input
          type="number"
          name="price"
          placeholder="enter price"
          className="form-control mb-2"
          value={productForm.price || ''}
          onChange={handleProductChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="enter stock quantity"
          className="form-control mb-2"
          value={productForm.stock || ''}
          onChange={handleProductChange}
        />
        <input
          type="text"
          name="imagePath"
          placeholder="Image file name"
          className="form-control mb-2"
          value={productForm.imagePath}
          onChange={handleProductChange}
        />
        <button className={`btn ${editingProduct ? 'btn-warning' : 'btn-primary'}`}>
          {editingProduct ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      {confirmCreateProduct && (
        <div className="alert alert-secondary mb-4">
          <p>Are you sure you want to create this product?</p>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setConfirmCreateProduct(false)}
          >
            No
          </button>
          <button className="btn btn-success" onClick={createProduct}>
            Yes
          </button>
        </div>
      )}

      {confirmUpdateProduct && (
        <div className="alert alert-secondary mb-4">
          <p>Are you sure you want to update this product?</p>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setConfirmUpdateProduct(false)}
          >
            No
          </button>
          <button className="btn btn-success" onClick={updateProduct}>
            Yes
          </button>
        </div>
      )}

      <table className="table table-bordered mb-5">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={`/images/${product.imagePath}`}
                  alt={product.name}
                  width="60"
                  height="80"
                />
              </td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <div className="d-flex flex-nowrap">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setProductForm(product);
                      setEditingProduct(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setDeleteProductId(product.id);
                      setConfirmDeleteProduct(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDeleteProduct && (
        <div className="alert alert-secondary mb-3">
          <p>Are you sure you want to delete this product?</p>
          <button
            className="btn btn-secondary me-2"
            onClick={() => setConfirmDeleteProduct(false)}
          >
            No
          </button>
          <button className="btn btn-success" onClick={deleteProduct}>
            Yes
          </button>
        </div>
      )}
    </div>
  );
}
