import { apiFetch, ORDER_STATUSES, STATUS_COLORS, money } from "../config";
import React, { useEffect, useState } from "react";
import { Carousel } from 'react-responsive-carousel';

const ORDERS_PER_SLIDE = 5;

export function MyOrder() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    apiFetch('/orders')
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));

  const updateOrderStatus = async (orderId, status) => {
    const response = await apiFetch(`/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      const updated = await response.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } else {
      alert('Failed to update order status');
    }
  };

  // One block per order: a summary row, then one row per item
  const renderOrderTable = (chunk) => (
    <table className="product-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>Order ID</th>
          <th>Item</th>
          <th>Amount</th>
          <th>Price</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {chunk.map((order) => (
          <React.Fragment key={order._id}>
            <tr>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{order.phoneNumber}</td>
              <td>{order.email}</td>
              <td>{order._id.slice(-8)}</td>
              <td colSpan={3}>{order.address}</td>
              <td><strong>{money(order.total)}</strong></td>
              <td>
                <select
                  className="order-status-dropdown"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  style={{ backgroundColor: STATUS_COLORS[order.status] }}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </td>
            </tr>
            {order.items.map((item, i) => (
              <tr key={`${order._id}-${i}`}>
                <td colSpan={4}></td>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                <td>{money(item.price)}</td>
                <td>{money(item.price * item.amount)}</td>
                <td></td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );

  if (orders === null) return <div className="order-container">Loading orders...</div>;

  return (
    <div>
      <div className="order-container">
        {orders.length ? (
          <Carousel showThumbs={false}>
            {chunkArray(orders, ORDERS_PER_SLIDE).map((chunk, index) => (
              <div key={index}>{renderOrderTable(chunk)}</div>
            ))}
          </Carousel>
        ) : (
          "No orders found"
        )}
      </div>
    </div>
  );
}
