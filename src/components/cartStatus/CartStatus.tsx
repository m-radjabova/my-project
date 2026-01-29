import {
  FaClock,
  FaCommentAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhone,
  FaTag,
  FaUser,
} from "react-icons/fa";
import { useState, useMemo } from "react";
import { GiKnifeFork } from "react-icons/gi";
import { useOrders } from "../../hooks/useOrders";
import type { Order } from "../../types/types";

function CartStatus() {
  const { myOrders: orders, isLoadingMyOrders: loading } = useOrders();
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed" | "delivered">(
    "all"
  );
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
    <div className="cart-page">
      <div className="cart-page-container">
        <div className="cart-page-title">
          <h1>
            My Order Status <FaTag />
          </h1>
        </div>

        <div className="cart-status-body">
          <div className="cart-status-header">
            <div className="order-count">
              <span className="order-number">{filteredOrders.length}</span>
              <span>
                order{filteredOrders.length !== 1 ? "s" : ""}{" "}
                {filterStatus !== "all" ? filterStatus : ""}
              </span>
            </div>

            <div className="status-filter">
              {(["all", "pending", "completed", "delivered"] as const).map((s) => (
                <button
                  key={s}
                  className={`filter-btn ${filterStatus === s ? "active" : ""}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s === "all" ? "All Orders" : s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="order-status">
            <div className="order-status-container">
              <div className="chef-page-content">
                {filteredOrders.length === 0 ? (
                  <div className="no-orders">
                    <GiKnifeFork className="no-orders-icon" />
                    <h3>No orders found</h3>
                    <p>When new orders come in, they'll appear here.</p>
                  </div>
                ) : (
                  <div className="orders-status-grid">
                    {filteredOrders.map((order : any) => {
                      const items = (order.items ?? order.products ?? []) as any[];

                      return (
                        <div className="order-status-card" key={order.id}>
                          {/* Header */}
                          <div className="order-status-header">
                            <div className="order-status-customer">
                              <div className="order-status-customer-avatar">
                                <FaUser className="order-status-customer-icon" />
                              </div>
                              <div>
                                <h3>{order.user?.name || "You"}</h3>
                                <span className="order-id">
                                  Order #{order.id ? String(order.id).slice(-6) : "------"}
                                </span>
                              </div>
                            </div>
                            <div className={getStatusBadgeClass(order.status)}>
                              {String(order.status)}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="order-status-details">
                            {order.shipping_address && (
                              <div className="status-detail-item">
                                <FaMapMarkerAlt className="detail-icon" />
                                <span className="address-text">{order.shipping_address}</span>
                              </div>
                            )}

                            {order.total_price != null && (
                              <div className="status-detail-item">
                                <FaMoneyBillWave className="detail-icon" />
                                <span>
                                  ${Number(order.total_price).toFixed(2)} •{" "}
                                  {order.payment_method ?? "N/A"}
                                </span>
                              </div>
                            )}

                            {order.created_at && (
                              <div className="status-detail-item">
                                <FaClock className="detail-icon" />
                                <span>{new Date(order.created_at).toLocaleString()}</span>
                              </div>
                            )}

                            {order.notes && (
                              <div className="status-detail-item">
                                <FaCommentAlt className="detail-icon" />
                                <span>{order.notes}</span>
                              </div>
                            )}

                            {order.location && (
                              <div className="status-detail-item">
                                <FaMapMarkerAlt className="detail-icon" />
                                <span>
                                  Lat: {order.location.lat}, Lng: {order.location.lng}
                                </span>
                              </div>
                            )}

                            {order.phone && (
                              <div className="status-detail-item">
                                <FaPhone className="detail-icon" />
                                <span>{order.phone}</span>
                              </div>
                            )}
                          </div>

                          {/* Items */}
                          <div className="stats-order-products">
                            <h4>Order Items ({Array.isArray(items) ? items.length : 0})</h4>

                            <div className="status-product-cards">
                              {Array.isArray(items) &&
                                items.map((it: any, index: number) => (
                                  <div className="status-product-card" key={it.id ?? index}>
                                    <div className="status-product-image-container">
                                      <img
                                        className="status-product-image"
                                        src={`${API_ORIGIN}${it.product?.image || it.image || ""}`}
                                        alt={it.product?.name || it.name || `Product ${index + 1}`}
                                      />
                                    </div>

                                    <div className="status-product-info">
                                      <div className="status-product-header">
                                        <span className="status-product-quantity">
                                          {it.quantity}x
                                        </span>
                                        <span className="status-product-name">
                                          {it.product?.name || it.name || `Product ${index + 1}`}
                                        </span>
                                      </div>

                                      <div className="status-product-details">
                                        {(it.product?.description || it.description) && (
                                          <span className="chef-product-description">
                                            {it.product?.description || it.description}
                                          </span>
                                        )}

                                        <div className="status-product-meta">
                                          <span className="chef-product-price">
                                            $
                                            {typeof it.price === "number"
                                              ? it.price.toFixed(2)
                                              : typeof it.product?.price === "number"
                                              ? it.product.price.toFixed(2)
                                              : "0.00"}
                                          </span>

                                          {(it.product?.weight || it.weight) && (
                                            <span className="chef-product-weight">
                                              • {it.product?.weight || it.weight}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartStatus;