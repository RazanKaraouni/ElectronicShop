import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [productNames, setProductNames] = useState({});
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders/my');
      setOrders(response.data);
      const names = {};
      for (const order of response.data) {
        const productResponse = await api.get(`/products/${order.productId}`);
        names[order.productId] = productResponse.data.name;
      }
      setProductNames(names);
    } catch {
      setError('Failed to load orders');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2>My Orders</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{productNames[order.productId]}</td>
              <td>{order.quantity}</td>
              <td>${order.totalPrice}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
