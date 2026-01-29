import { LuChefHat } from "react-icons/lu";
import {
  FaClock,
  FaCommentAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTruck,
  FaUser,
} from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { useMemo, useState } from "react";
import useContextPro from "../../hooks/useContextPro";
import { useOrders } from "../../hooks/useOrders";
import type { Order } from "../../types/types";

function ChefPage() {
  const {
    state: { user },
    dispatch,
  } = useContextPro();

  const { orders, loading, updateStatus } = useOrders();

  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

  const filteredOrders = useMemo(() => {
    if (filterStatus === "all") return orders;
    return orders.filter((o: Order) => String(o.status).toLowerCase() === filterStatus);
  }, [orders, filterStatus]);

  const getStatusBadgeClass = (status: string) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return "status-badge status-pending";
      case "completed":
        return "status-badge status-completed";
      case "delivered":
        return "status-badge status-delivered";
      default:
        return "status-badge";
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: "completed" | "delivered") => {
    try {
      setSubmittingId(orderId);
      await updateStatus({ orderId, status: newStatus });
    } catch (e) {
      console.error("Error updating order status:", e);
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-carousel">
        <div className="loading-state">
          <div className="dash-loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chef-page">
      <div className="chef-page-header">
        <div className="chef-page-title">
          <div className="title-container">
            <LuChefHat className="chef-icon" />
            <div>
              <h1>Chef's Kitchen</h1>
              <p>Manage your orders efficiently</p>

              <div className="chef-info-panel">
                <p className="panel-user-info">Logged in as: {user?.name}</p>
                <p className="panel-user-info">Email: {user?.email}</p>
                <button className="logout-button" onClick={() => dispatch({ type: "LOGOUT" })}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="orders-count">
            <span className="count-number">{filteredOrders.length}</span>
            <span>order{filteredOrders.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <div className="status-filter">
          <button
            className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All Orders
          </button>

          <button
            className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>

          <button
            className={`filter-btn ${filterStatus === "completed" ? "active" : ""}`}
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="chef-page-container">
        <div className="chef-page-content">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <GiKnifeFork className="no-orders-icon" />
              <h3>No orders found</h3>
              <p>When new orders come in, they'll appear here.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order: any) => {
                const items = (order.items ?? order.products ?? []) as any[];

                const orderIdNum = Number(order.id);

                return (
                  <div className="order-card" key={order.id}>
                    <div className="order-header">
                      <div className="order-customer">
                        <div className="customer-avatar">
                          <FaUser className="customer-icon" />
                        </div>
                        <div>
                          <h3>{order.user?.name || "Customer"}</h3>
                          <span className="order-id">
                            Order #{order.id ? String(order.id).slice(-6) : "------"}
                          </span>
                        </div>
                      </div>

                      <div className={getStatusBadgeClass(order.status)}>{order.status}</div>
                    </div>

                    <div className="order-details">
                      {order.shipping_address && (
                        <div className="detail-item">
                          <FaMapMarkerAlt className="detail-icon" />
                          <span className="address-text">{order.shipping_address}</span>
                        </div>
                      )}

                      {order.total_price != null && (
                        <div className="detail-item">
                          <FaMoneyBillWave className="detail-icon" />
                          <span>
                            ${Number(order.total_price).toFixed(2)} • {order.payment_method ?? "N/A"}
                          </span>
                        </div>
                      )}

                      {order.created_at && (
                        <div className="detail-item">
                          <FaClock className="detail-icon" />
                          <span>{new Date(order.created_at).toLocaleString()}</span>
                        </div>
                      )}

                      {order.notes && (
                        <div className="detail-item">
                          <FaCommentAlt className="detail-icon" />
                          <span>{order.notes}</span>
                        </div>
                      )}

                      {order.location && (
                        <div className="detail-item">
                          <FaMapMarkerAlt className="detail-icon" />
                          <span>
                            Lat: {order.location.lat}, Lng: {order.location.lng}
                          </span>
                        </div>
                      )}

                      {order.shipping_address && (
                        <div className="detail-item">
                          <FaTruck className="detail-icon" />
                          <span>{order.shipping_address}</span>
                        </div>
                      )}
                    </div>

                    <div className="order-products">
                      <h4>Order Items ({Array.isArray(items) ? items.length : 0})</h4>

                      <div className="chef-product-cards">
                        {Array.isArray(items) &&
                          items.map((it: any, index: number) => (
                            <div className="chef-product-card" key={it.id ?? index}>
                              <div className="chef-product-image-container">
                                <img
                                  className="chef-product-image"
                                  src={`${API_ORIGIN}${it.image}`}
                                  alt={it.name || `Product ${index + 1}`}
                                />
                              </div>

                              <div className="product-info">
                                <div className="product-header">
                                  <span className="chef-product-quantity">{it.quantity}x</span>
                                  <span className="chef-product-name">
                                    {it.name || `Product ${index + 1}`}
                                  </span>
                                </div>

                                <div className="product-details">
                                  {it.description && (
                                    <span className="chef-product-description">{it.description}</span>
                                  )}
                                  <div className="product-meta">
                                    <span className="chef-product-price">
                                      ${typeof it.price === "number" ? it.price.toFixed(2) : "0.00"}
                                    </span>
                                    {it.weight && (
                                      <span className="chef-product-weight">• {it.weight}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="order-actions">
                      {String(order.status).toLowerCase() === "pending" && (
                        <button
                          onClick={() => handleUpdateStatus(orderIdNum, "completed")}
                          className="action-btn update-btn"
                          disabled={submittingId === orderIdNum}
                        >
                          {submittingId === orderIdNum ? "Updating..." : "Done Cooking"}
                        </button>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChefPage;