import { apiFetch, ORDER_STATUSES, STATUS_COLORS, money } from "../config";
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ShoppingCart, Users, Package, DollarSign } from 'lucide-react';

// Orders that count as sales
const isSale = (order) => !['cancelled', 'refunded'].includes(order.status);

// Sales per month for the last 7 months, from real orders
const monthlySales = (orders) => {
  const now = new Date();
  const months = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 6 + i, 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, name: d.toLocaleString('en', { month: 'short' }), sales: 0, orders: 0 };
  });
  const byKey = Object.fromEntries(months.map((m) => [m.key, m]));
  for (const order of orders.filter(isSale)) {
    const d = new Date(order.createdAt);
    const m = byKey[`${d.getFullYear()}-${d.getMonth()}`];
    if (m) {
      m.sales = Math.round((m.sales + order.total) * 100) / 100;
      m.orders += 1;
    }
  }
  return months;
};

export const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        apiFetch('/orders'),
        apiFetch('/users'),
        apiFetch('/products'),
      ]);
      setOrders(await ordersRes.json());
      setUsers(await usersRes.json());
      setProducts(await productsRes.json());
      setError(null);
    } catch (err) {
      if (err.message !== 'Not authorized') setError('Cannot reach the server. Is the backend running?');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;
    const response = await apiFetch(`/orders/${id}`, { method: 'DELETE' });
    if (response.ok) setOrders((prev) => prev.filter((o) => o._id !== id));
  };

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

  const totalSales = orders.filter(isSale).reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === 'pending').length;
  const admins = users.filter((u) => u.role === 'admin').length;
  const categories = new Set(products.map((p) => p.category)).size;

  const orderOverviewData = ORDER_STATUSES
    .map((status) => ({ name: status, value: orders.filter((o) => o.status === status).length, color: STATUS_COLORS[status] }))
    .filter((d) => d.value > 0);

  return (
    <div className='dashboard'>
      <header className="header page-heading">
        <div className="header-content">
          <h1 className="header-title">Ecommerce</h1>
        </div>
      </header>
      <main className="main-content">
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        <div className="stat-card-grid">
          <StatCard title="Total Users" value={users.length} icon={<Users />} change={`${users.length - admins} customers, ${admins} admin${admins === 1 ? '' : 's'}`} color="#22c55e" />
          <StatCard title="Total Orders" value={orders.length} icon={<ShoppingCart />} change={`${pending} pending`} color="#8b5cf6" />
          <StatCard title="Total Sales" value={money(totalSales)} icon={<DollarSign />} change="Excludes cancelled and refunded" color="#3b82f6" />
          <StatCard title="Total Products" value={products.length} icon={<Package />} change={`${categories} categories`} color="#60a5fa" />
        </div>

        <div>
          <h2 className="section-title">Recent Orders</h2>
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  {['ORDER ID', 'EMAIL', 'ORDER DATE', 'ITEMS', 'TOTAL', 'STATUS', 'ACTION'].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={7}>No orders yet</td></tr>
                )}
                {orders.slice(0, 10).map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8)}</td>
                    <td>{order.email}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.items.map((i) => `${i.name} x${i.amount}`).join(', ')}</td>
                    <td>{money(order.total)}</td>
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
            <h2 className="chart-title">Sales (last 7 months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlySales(orders)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => (name === 'sales' ? money(value) : value)} />
                <Area type="monotone" dataKey="sales" stroke="#82ca9d" fill="#82ca9d" />
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
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderOverviewData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
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
