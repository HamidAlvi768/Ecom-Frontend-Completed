import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MoreHorizontal, RefreshCw, ShoppingCart, Users, Package, Star, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const ordersResponse = await fetch('https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/orders');
      const ordersData = await ordersResponse.json();
      setOrders(ordersData);

      const usersResponse = await fetch('https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/users');
      const usersData = await usersResponse.json();
      setUsers(usersData);

      const productsResponse = await fetch('https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/products', {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      const productsData = await productsResponse.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteOrder = async (id) => {
    await fetch(`https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/order/${id}`, {
      method: 'DELETE',
    });
    fetchData();
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
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#fcd34d',
      shipped: '#60a5fa',
      delivered: '#4ade80',
      cancelled: '#fca5a1',
      refunded: '#fcd34d'
    };
    return colors[status] || '#6b7280'; // default color if status is not recognized
  };

  const revenueData = [
    { name: 'Jan', invested: 0, earnings: 0, expenses: 0 },
    { name: 'Feb', invested: 0, earnings: 0, expenses: 0 },
    { name: 'Mar', invested: 0, earnings: 0, expenses: 0 },
    { name: 'Apr', invested: 0, earnings: 0, expenses: 0 },
    { name: 'May', invested: 0, earnings: 0, expenses: 0 },
    { name: 'Jun', invested: 0, earnings: 0, expenses: 0 },
    { name: 'Jul', invested: 0, earnings: 0, expenses: 0 },  ];

  const orderOverviewData = orders.reduce((acc, order) => {
    const status = order.status || 'pending';
    const existingStatus = acc.find(item => item.name === status);
    if (existingStatus) {
      existingStatus.value += 1;
    } else {
      acc.push({ name: status, value: 1, color: getStatusColor(status) });
    }
    return acc;
  }, []);

  return (
    <div className='dashboard'>
      <header className="header page-heading">
        <div className="header-content">
          <h1 className="header-title">Ecommerce</h1>
        </div>
      </header>
      <main className="main-content">
        <div className="stat-card-grid">
          <StatCard title="Total Users" value={users.length.toString()} icon={<Users />} change="+98% Last Month" color="#22c55e" />
          <StatCard title="Total Orders" value={orders.length.toString()} icon={<ShoppingCart />} change="+20% Last Month" color="#8b5cf6" />
          <StatCard title="Total Sales" value={`$${orders.reduce((total, order) =>  total + order.order_data[0].reduce((orderTotal, item) => orderTotal + (item.item ? parseFloat(item.item.price) * item.amount : 0), 0), 0).toFixed(2)}`} icon={<DollarSign />} change="+0.3% Last Month" color="#3b82f6" />
          <StatCard title="Total Products" value={products.length.toString()} icon={<Package />} change="+25% Last Month" color="#60a5fa" />
          {/* <StatCard title="Total Reviews" value="166" icon={<Star />} change="+8.5% Last Month" color="#fbbf24" /> */}
        </div>

        <div>
          <h2 className="section-title">Orders</h2>
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  {['ORDER ID', 'EMAIL', 'ORDER DATE', 'PRODUCT', 'PRICE', 'QUANTITY', 'TOTAL', 'STATUS', 'ACTION'].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.email.replace(/"/g, '')}</td>
                    <td>{order.order_data[0][0].Order_date}</td>
                    <td>{order.order_data[0][1].item.name}</td>
                    <td>${parseFloat(order.order_data[0][1].item.price).toFixed(2)}</td>
                    <td>{order.order_data[0][1].amount}</td>
                    <td>${(parseFloat(order.order_data[0][1].item.price) * order.order_data[0][1].amount).toFixed(2)}</td>
                    <td>
                      <select 
                        className="order-status-dropdown"
                        value={order.status || 'pending'}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        style={{ backgroundColor: getStatusColor(order.status || 'pending') }}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => deleteOrder(order._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-grid">
          <div className="chart-container">
            <h2 className="chart-title">Revenue Report</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="invested" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="earnings" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h2 className="chart-title">Orders Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderOverviewData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderOverviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, change, color }) => (
  <div className="stat-card" style={{ backgroundColor: color }}>
    <div className="stat-card-header">
      <h3 className="stat-card-title">{title}</h3>
      {icon}
    </div>
    <p className="stat-card-value">{value}</p>
    <p className="stat-card-change">{change}</p>
  </div>
);