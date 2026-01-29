import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import useOrderProducts from "../../../hooks/useOrderProducts";
import { useOrders } from "../../../hooks/useOrders";
import type { GroupedOrderProduct, Order } from "../../../types/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const { groupedProducts, loading } = useOrderProducts();
  const { orders, loading: ordersLoading } = useOrders();

  const toNum = (v: unknown): number => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const getRevenue = (p: GroupedOrderProduct): number => {
    const tp = toNum(p.total_price);
    if (tp > 0) return tp;
    return toNum(p.price) * toNum(p.quantity);
  };

  const totalRevenue = useMemo(() => {
    return groupedProducts.reduce((acc, p) => acc + getRevenue(p), 0);
  }, [groupedProducts]);

  const totalProducts = useMemo(() => {
    return groupedProducts.reduce((acc, p) => acc + toNum(p.quantity), 0);
  }, [groupedProducts]);

  const activeOrders = useMemo(() => {
    const list = (orders ?? []) as Order[];
    return list.filter((o) => {
      const s = String(o.status).toLowerCase();
      return s === "pending" || s === "completed";
    }).length;
  }, [orders]);

  const chartData = useMemo(() => {
    return {
      labels: groupedProducts.map((p) => String(p.name ?? "")),
      datasets: [
        {
          label: "Revenue ($)",
          data: groupedProducts.map((p) => getRevenue(p)),
          backgroundColor: "rgba(220, 53, 69, 0.7)",
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [groupedProducts]);

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Revenue by Product" },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${toNum(ctx.raw).toFixed(2)}`,
        },
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  if (loading || ordersLoading) {
    return (
      <div className="admin-loading">
        <div className="dash-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">{totalRevenue.toFixed(2)} $</div>
          <div className="stat-trend positive">+12% from last month</div>
        </div>

        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-trend positive">+5% from last month</div>
        </div>

        <div className="stat-card">
          <h3>Active Orders</h3>
          <div className="stat-value">{activeOrders}</div>
          <div className="stat-trend negative">-2% from last month</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-container">
          <h2>Product Revenue</h2>
          <div className="chart-wrapper">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="dash-products-list">
          <div className="dash-list-header">
            <h2>Products List</h2>
            <span className="dash-product-count">{groupedProducts.length} products</span>
          </div>

          <div className="dash-products-scroll">
            {groupedProducts.map((p, index) => {
              const revenue = getRevenue(p); 
              return (
                <div key={p.product_id ?? p.id ?? p.name ?? index} className="dash-product-item">
                  <div className="dash-product-info">
                    <span className="dash-product-name">{p.name ?? "Unnamed product"}</span>
                    <span className="dash-product-quantity">{toNum(p.quantity)} units</span>
                  </div>

                  {/* ✅ oldin price chiqardi, endi revenue chiqadi */}
                  <div className="dash-product-price">{revenue.toFixed(2)} $</div>
                </div>
              );
            })}
          </div>

          <div className="dash-list-footer">
            <div className="dash-total-price">
              Total: <strong>{totalRevenue.toFixed(2)} $</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
