import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import {
  FaClock,
  FaCommentAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhone,
  FaTruck,
  FaUser,
} from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { useMemo, useState } from "react";
import useContextPro from "../../hooks/useContextPro";
import { SiWine } from "react-icons/si";
import UseModal from "../../hooks/UseModal";
import RouteMap from "./RouteMap";
import { useOrders } from "../../hooks/useOrders";

function WaiterPage() {
  const {
    state: { user },
    dispatch,
  } = useContextPro();

  const { orders, loading, updateStatus } = useOrders();

  const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed" | "delivered">(
    "all"
  );
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderLocation, setSelectedOrderLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);

  const filteredOrders = useMemo(() => {
    const byStatus =
      filterStatus === "all"
        ? orders
        : orders.filter((o: any) => String(o.status).toLowerCase() === filterStatus);

    return byStatus.filter(
      (o: any) =>
        o?.location &&
        typeof o.location.lat === "number" &&
        typeof o.location.lng === "number"
    );
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

  const handleUpdateStatus = async (orderId: number, newStatus: "delivered") => {
    try {
      setSubmittingId(orderId);
      await updateStatus({ orderId, status: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleShowRoute = (orderLocation: { lat: number; lng: number }) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDriverLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSelectedOrderLocation(orderLocation);
        setIsModalOpen(true);
      },
      () => alert("Location permission denied")
    );
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
            <SiWine className="chef-icon" />
            <div>
              <h1>Waiter Dashboard</h1>
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
                const orderIdNum = Number(order.id); 
                const items = (order.items ?? order.products ?? []) as any[];

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

                    <div className="order-status-details p-2">
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
                            ${Number(order.total_price).toFixed(2)} • {order.payment_method ?? "N/A"}
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
                        <div
                          className="status-detail-item clickable order-ohone"
                          onClick={() => handleShowRoute(order.location)}
                        >
                          <FaMapMarkerAlt className="detail-icon" />
                          <span>
                            Lat: {order.location.lat}, Lng: {order.location.lng} (View Route)
                          </span>
                        </div>
                      )}

                      {order.phone && (
                        <div className="status-detail-item">
                          <FaPhone className="detail-icon" />
                          <span>{order.phone}</span>
                        </div>
                      )}

                      {order.shipping_address && (
                        <div className="status-detail-item">
                          <FaTruck className="detail-icon" />
                          <span>{order.shipping_address}</span>
                        </div>
                      )}
                    </div>

                    <div className="order-products">
                      <h4>Order Items ({Array.isArray(items) ? items.length : 0})</h4>

                      <div className="chef-product-cards">
                        {Array.isArray(items) &&
                          items.map((product: any, index: number) => (
                            <div className="chef-product-card" key={product.id ?? index}>
                              <div className="chef-product-image-container">
                                <img
                                  className="chef-product-image"
                                  src={`${API_ORIGIN}${product.image}`}
                                  alt={product.name || `Product ${index + 1}`}
                                />
                              </div>

                              <div className="product-info">
                                <div className="product-header">
                                  <span className="chef-product-quantity">{product.quantity}x</span>
                                  <span className="chef-product-name">
                                    {product.name || `Product ${index + 1}`}
                                  </span>
                                </div>

                                <div className="product-details">
                                  {product.description && (
                                    <span className="chef-product-description">{product.description}</span>
                                  )}

                                  <div className="product-meta">
                                    <span className="chef-product-price">
                                      ${product.price?.toFixed?.(2) ?? "0.00"}
                                    </span>
                                    {product.weight && (
                                      <span className="chef-product-weight">• {product.weight}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="order-actions">
                      {String(order.status).toLowerCase() !== "delivered" && (
                        <button
                          onClick={() => handleUpdateStatus(orderIdNum, "delivered")}
                          className="action-btn update-btn"
                          disabled={submittingId === orderIdNum}
                        >
                          {submittingId === orderIdNum ? "Updating..." : "Mark as Delivered"}
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

      <UseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
        {driverLocation && selectedOrderLocation ? (
          <div style={{ width: "100%", height: "500px" }}>
            <RouteMap origin={driverLocation} destination={selectedOrderLocation} />
          </div>
        ) : (
          <p>Loading route...</p>
        )}
      </UseModal>
    </div>
  );
}

export default WaiterPage;