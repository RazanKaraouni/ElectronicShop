import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState(0);
  const [brandFilters, setBrandFilters] = useState([]);
  const [error, setError] = useState('');

  const getBrand = (name) => name.split(' ')[0];
  const matchesCategory = (product) =>
    categoryFilter === 0 || product.categoryId === categoryFilter;
  const matchesPrice = (product) => {
    if (priceFilter === 0) return true;
    if (priceFilter === 1) return product.price < 500;
    if (priceFilter === 2) return product.price >= 500 && product.price < 1000;
    if (priceFilter === 3) return product.price >= 1000;
    return true;
  };
  const matchesBrand = (product) =>
    brandFilters.length === 0 || brandFilters.includes(getBrand(product.name));

  const loadProducts = async () => {
    try {
      setProducts((await axios.get('/api/products')).data);
    } catch {
      setError('Failed to load products');
    }
  };

  const loadCategories = async () => {
    try {
      setCategories((await api.get('/categories')).data);
    } catch {
      setError('Failed to load categories');
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const categoryFiltered = products.filter(matchesCategory);
  const filteredProducts = categoryFiltered.filter(
    (product) => matchesPrice(product) && matchesBrand(product),
  );
  const noPriceMatch =
    priceFilter !== 0 && categoryFiltered.filter(matchesCategory).length === 0;
  const noBrandMatch =
    brandFilters.length > 0 &&
    categoryFiltered.filter((product) => matchesPrice(product) && matchesBrand(product))
      .length === 0 &&
    categoryFiltered.filter(matchesCategory).length > 0;
  const brands = [...new Set(products.map((product) => getBrand(product.name)))].sort();

  const handleBrandChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setBrandFilters([...brandFilters, value]);
    } else {
      setBrandFilters(brandFilters.filter((brand) => brand !== value));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-1 text-start">Products</h2>
      <p className="text-muted mb-4 text-start">{filteredProducts.length} products</p>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3 text-start">
        <p className="mb-2">Filter by Category</p>
        <button
          className={`btn btn-sm me-2 mb-2 ${categoryFilter === 0 ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setCategoryFilter(0)}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`btn btn-sm me-2 mb-2 ${categoryFilter === category.id ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setCategoryFilter(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mb-3 text-start">
        <p className="mb-2">Filter by Price</p>
        <button
          className={`btn btn-sm me-2 mb-2 ${priceFilter === 0 ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setPriceFilter(0)}
        >
          All Prices
        </button>
        <button
          className={`btn btn-sm me-2 mb-2 ${priceFilter === 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setPriceFilter(1)}
        >
          Under $500
        </button>
        <button
          className={`btn btn-sm me-2 mb-2 ${priceFilter === 2 ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setPriceFilter(2)}
        >
          $500 - $999
        </button>
        <button
          className={`btn btn-sm me-2 mb-2 ${priceFilter === 3 ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setPriceFilter(3)}
        >
          $1000 and above
        </button>
      </div>

      <div className="mb-4 text-start">
        <p className="mb-2">Filter by Brand</p>
        {brands.map((brand) => (
          <div key={brand} className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              value={brand}
              checked={brandFilters.includes(brand)}
              onChange={handleBrandChange}
              id={`brand-${brand}`}
            />
            <label className="form-check-label" htmlFor={`brand-${brand}`}>
              {brand}
            </label>
          </div>
        ))}
      </div>

      {noPriceMatch && (
        <div className="alert alert-warning">no devices at this price</div>
      )}
      {noBrandMatch && (
        <div className="alert alert-warning">no devices from this brand</div>
      )}

      <div className="row">
        {filteredProducts.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100 product-card">
              <img
                src={`/images/${product.imagePath}`}
                className="card-img-top product-img"
                alt={product.name}
              />
              <div className="card-body text-start">
                <h5 className="card-title">{product.name}</h5>
                <p className="fw-bold mb-1">${product.price}</p>
                <p className="text-muted mb-3">Stock: {product.stock}</p>
                <Link className="btn btn-primary" to={`/details/${product.id}`}>
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
