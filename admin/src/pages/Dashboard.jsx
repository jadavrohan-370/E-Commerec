import React, { useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  MdTrendingUp,
  MdTrendingDown,
  MdAttachMoney,
  MdShoppingCart,
  MdInventory,
} from "react-icons/md";
import gsap from "gsap";
import "./Dashboard.css";

const Dashboard = () => {
  const cardsRef = useRef([]);
  const chartsRef = useRef([]);

  const [stats, setStats] = React.useState({
    totalSales: 0,
    totalOrders: 0,
    stockValue: 0,
    revenue: 0,
  });

  const [salesData, setSalesData] = React.useState([
    { name: "Mon", sales: 0 },
    { name: "Tue", sales: 0 },
    { name: "Wed", sales: 0 },
    { name: "Thu", sales: 0 },
    { name: "Fri", sales: 0 },
    { name: "Sat", sales: 0 },
    { name: "Sun", sales: 0 },
  ]);

  const [profitData, setProfitData] = React.useState([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
    );

    gsap.fromTo(
      chartsRef.current,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        stagger: 0.2,
        ease: "back.out(1.2)",
      },
    );

    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("http://localhost:5000/api/orders", { credentials: "include" }),
          fetch("http://localhost:5000/api/products"),
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        const ordersList = Array.isArray(ordersData)
          ? ordersData
          : ordersData.orders || [];
        const productsList = Array.isArray(productsData)
          ? productsData
          : productsData.products || [];

        const totalOrders = ordersList.length;
        const totalSales = ordersList.reduce(
          (acc, order) => acc + (order.totalPrice || 0),
          0,
        );
        const revenue = ordersList
          .filter((o) => o.isPaid)
          .reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        const stockValue = productsList.reduce(
          (acc, product) =>
            acc + (product.price || 0) * (product.countInStock || 0),
          0,
        );

        setStats({ totalSales, totalOrders, stockValue, revenue });

        // Generate dynamic chart data based on order dates
        if (ordersList.length > 0) {
          const recentOrders = ordersList.slice(-20); // Last 20 orders
          const dynamicSalesData = recentOrders.map((o) => ({
            name: new Date(o.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            }),
            sales: o.totalPrice || 0,
          }));
          setSalesData(dynamicSalesData);
          setProfitData(
            dynamicSalesData.map((d) => ({
              name: d.name,
              profit: d.sales * 0.3,
            })),
          ); // Mock 30% profit
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (val) =>
    "$" +
    val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const statCards = [
    {
      title: "Total Sales (All)",
      value: formatCurrency(stats.totalSales),
      change: "+12.5%",
      isUp: true,
      icon: <MdAttachMoney />,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: "+5.2%",
      isUp: true,
      icon: <MdShoppingCart />,
    },
    {
      title: "Stock Value",
      value: formatCurrency(stats.stockValue),
      change: "-2.4%",
      isUp: false,
      icon: <MdInventory />,
    },
    {
      title: "Revenue (Paid)",
      value: formatCurrency(stats.revenue),
      change: "+8.4%",
      isUp: true,
      icon: <MdTrendingUp />,
    },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back, here's what's happening today.</p>
        </div>
        <button className="btn-primary">Download Report</button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card glass-panel"
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <div
                className={`stat-change ${stat.isUp ? "positive" : "negative"}`}
              >
                {stat.isUp ? <MdTrendingUp /> : <MdTrendingDown />}
                {stat.change}
              </div>
            </div>
            <div className="stat-body">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div
          className="chart-container glass-panel"
          ref={(el) => (chartsRef.current[0] = el)}
        >
          <div className="chart-header">
            <h3>Revenue Overview</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#6366f1" }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="chart-container glass-panel"
          ref={(el) => (chartsRef.current[1] = el)}
        >
          <div className="chart-header">
            <h3>Weekly Profit</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={profitData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="profit" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
