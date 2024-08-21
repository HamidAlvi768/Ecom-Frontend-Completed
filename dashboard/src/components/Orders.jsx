import React, { useEffect, useState } from "react";
import { Carousel } from 'react-responsive-carousel';

export function MyOrder() {
  const [orderData, setorderData] = useState({});

  const fetchMyOrder = async () => {
    await fetch(
      "https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/orders"
    ).then(async (res) => {
      let response = await res.json();
      setorderData(response);
    });
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#fcd34d',
      shipped: '#60a5fa',
      delivered: '#4ade80',
      cancelled: '#fca5a1',
      refunded: '#fcd34d'
    };
    return colors[status] || '#6b7280';
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setorderData(prevData => {
          const updatedData = Array.isArray(prevData) ? [...prevData] : { ...prevData };
          const orderToUpdate = Array.isArray(updatedData) 
            ? updatedData.find(order => order._id === orderId)
            : updatedData;
          
          if (orderToUpdate) {
            orderToUpdate.status = newStatus;
          }
          return updatedData;
        });
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const renderOrderTable = (orders) => (
    <table className="product-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>UID</th>
          <th>Item</th>
          <th>Amount</th>
          <th>Price</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((item) =>
          item.order_data.map((arrayData) =>
            arrayData.map((order) => (
              <tr key={order.item?.name || order.Order_date}>
                <td>{order.Order_date || ""}</td>
                <td>{order.Order_date && item.phoneNumber ? item.phoneNumber : ""}</td>
                <td>{order.Order_date && item.email || ""}</td>
                <td>{order.Order_date && item?._id || ""}</td>
                <td>{order.item?.name || ""}</td>
                <td>{order.amount || ""}</td>
                <td>{order.item?.price ? `Rs ${order.item.price}/-` : ""}</td>
                <td>{order.item?.price ? `Rs ${(order.item.price)*order.amount}/-` : ""}</td>
                <td>{order.Order_date && (
                  <select 
                    className="order-status-dropdown"
                    value={item.status || 'pending'}
                    onChange={(e) => updateOrderStatus(item._id, e.target.value)}
                    style={{ backgroundColor: getStatusColor(item.status || 'pending') }}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  )}
                </td>
              </tr>
            ))
          )
        )}
      </tbody>
    </table>
  );

  return (
    <div>
      <div className="order-container">
        {Object.keys(orderData).length !== 0 ? (
          <Carousel>
            {chunkArray(Array.isArray(orderData) ? orderData : [orderData], 5).map((chunk, index) => (
              <div key={index}>
                {renderOrderTable(chunk)}
              </div>
            ))}
          </Carousel>
        ) : (
          "No orders found"
        )}
      </div>
    </div>
  );
}
