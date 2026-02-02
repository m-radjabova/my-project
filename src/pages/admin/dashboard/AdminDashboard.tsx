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
import useDashboart from "../../../hooks/useDashboart";
import { IoFastFood } from "react-icons/io5";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function AdminDashboard() {
  const {
    range,
    setRange,
    list,
    chartLabels,
    chartValues,
    totalRevenue,
    totalProducts,
    activeOrders,
    loading,
    fetching,
    error,
  } = useDashboart();

  const chartData = useMemo(() => {
    return {
      labels: chartLabels,
      datasets: [
        {
          label: "Revenue ($)",
          data: chartValues,
          backgroundColor: "rgba(220, 53, 69, 0.7)",
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [chartLabels, chartValues]);

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Revenue by Product" },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${Number(ctx.raw ?? 0).toFixed(2)}`,
        },
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="dash-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-loading">
        <p style={{ color: "crimson" }}>
          Dashboard error: {(error as Error)?.message ?? "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="chef-page">
      <div className="chef-page-header">
        <div className="chef-page-title">
          <div className="title-container">
            <IoFastFood className="chef-icon" />
            <div>
              <h1>Admin Dashboard</h1>
              <p>Overview of key metrics and performance</p>
            </div>
          </div>
          <div className="admin-product-filters">
            <button
              className={`cat-pill ${range === "week" ? "active" : ""}`}
              onClick={() => setRange("week")}
            >
              Week
            </button>
            <button
              className={`cat-pill ${range === "month" ? "active" : ""}`}
              onClick={() => setRange("month")}
            >
              Month
            </button>
            <button
              className={`cat-pill ${range === "year" ? "active" : ""}`}
              onClick={() => setRange("year")}
            >
              Year
            </button>
            {fetching && (
              <span className="dashboard-updating">Updating...</span>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">{Number(totalRevenue).toFixed(2)} $</div>
        </div>

        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{totalProducts}</div>
        </div>

        <div className="stat-card">
          <h3>Active Orders</h3>
          <div className="stat-value">{activeOrders}</div>
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
            <span className="dash-product-count">{list.length} products</span>
          </div>

          <div className="dash-products-scroll">
            {list.map((p, index) => (
              <div key={p.product_id ?? index} className="dash-product-item">
                <div className="dash-product-info">
                  <span className="dash-product-name">
                    {p.name ?? "Unnamed product"}
                  </span>
                  <span className="dash-product-quantity">
                    {Number(p.units ?? 0)} units
                  </span>
                </div>

                <div className="dash-product-price">
                  {Number(p.revenue ?? 0).toFixed(2)} $
                </div>
              </div>
            ))}
          </div>

          <div className="dash-list-footer">
            <div className="dash-total-price">
              Total: <strong>{Number(totalRevenue).toFixed(2)} $</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;