import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [nextStatus, setNextStatus] = useState('');

  const loadOrders = async () => {
    try {
      setOrders((await api.get('/orders')).data);
    } catch {
      setError('Failed to load orders');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openConfirm = (order, status) => {
    setSelectedOrder(order);
    setNextStatus(status);
    setShowConfirm(true);
  };

  const updateOrderStatus = async () => {
    setShowConfirm(false);
    await api.put(`/orders/${selectedOrder.id}`, { ...selectedOrder, status: nextStatus });
    setSelectedOrder(null);
    setNextStatus('');
    loadOrders();
  };

  return (
    <div className="container mt-5">
      <h2>Orders</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <h4>
        Total Payments: $
        {orders.reduce((sum, order) => sum + order.paymentAmount, 0).toFixed(2)}
      </h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.username}</td>
              <td>{order.productName}</td>
              <td>${order.totalPrice}</td>
              <td>{order.paymentAmount > 0 ? `$${order.paymentAmount}` : '-'}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => openConfirm(order, 'Confirmed')}
                >
                  Confirm
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => openConfirm(order, 'Delivered')}
                >
                  Delivered
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm && (
        <div className="alert alert-secondary mt-3">
          <p>
            {nextStatus === 'Confirmed'
              ? 'Are you sure you want to confirm this order?'
              : 'Are you sure you want to mark this order as delivered?'}
          </p>
          <button className="btn btn-secondary me-2" onClick={() => setShowConfirm(false)}>
            No
          </button>
          <button className="btn btn-success" onClick={updateOrderStatus}>
            Yes
          </button>
        </div>
      )}
    </div>
  );
}
