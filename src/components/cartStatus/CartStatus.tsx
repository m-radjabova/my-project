import {
  FaClock,
  FaCommentAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhone,
  FaUser,
  FaTruck,
  FaShoppingBag,
  FaHistory,
  FaCalendarAlt,
  FaReceipt
} from "react-icons/fa";
import { useState, useMemo } from "react";
import { GiKnifeFork } from "react-icons/gi";
import { useOrders } from "../../hooks/useOrders";
import type { Order } from "../../hooks/useOrders";
import { API_ORIGIN } from "../../utils";
import type { OrderProduct } from "../../types/types";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { RiLoader2Line, RiCheckDoubleLine, RiTimerLine } from "react-icons/ri";

function CartStatus() {
  const { myOrders: orders, isLoadingMyOrders: loading } = useOrders();
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed" | "delivered">("all");
  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredOrders = useMemo(() => {
    let result = orders;
    
    if (filterStatus !== "all") {
      result = result.filter((o: Order) => 
        String(o.status).toLowerCase() === filterStatus
      );
    }
    return result.sort((a: Order, b: Order) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  }, [orders, filterStatus, searchTerm]);

  const getStatusIcon = (status: string) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return <RiLoader2Line className="status-icon" />;
      case "completed":
        return <RiCheckDoubleLine className="status-icon" />;
      case "delivered":
        return <TbTruckDelivery className="status-icon" />;
      default:
        return <RiTimerLine className="status-icon" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return "#FF9F43";
      case "completed":
        return "#10B981";
      case "delivered":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const getStatusProgress = (status: string) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return 25;
      case "completed":
        return 75;
      case "delivered":
        return 100;
      default:
        return 10;
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setActiveOrder(activeOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="admin-carousel">
        <div className="loading-state">
          <div className="dash-loading-spinner"></div>
          <h3>Loading Your Orders</h3>
          <p>Fetching your delicious journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-status-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="particles-container"></div>
      </div>

      <div className="order-status-container">
        {/* Header */}
        <div className="order-status-header">
          <div className="order-header-content">
            <div className="order-header-icon-wrapper">
              <FaShoppingBag className="order-header-icon" />
              <div className="icon-glow"></div>
            </div>
            <div>
              <h1>Order Journey</h1>
              <p className="order-header-subtitle">Track and manage all your delicious orders</p>
            </div>
          </div>
          
          <div className="order-stats-card">
            <div className="order-stat-item">
              <div className="order-stat-icon total">
                <FaReceipt />
              </div>
              <div>
                <div className="order-stat-number">{orders.length}</div>
                <div className="order-stat-label">Total Orders</div>
              </div>
            </div>
            <div className="order-stat-item">
              <div className="order-stat-icon pending">
                <RiLoader2Line />
              </div>
              <div>
                <div className="order-stat-number">
                  {orders.filter((o: Order) => o.status === 'pending').length}
                </div>
                <div className="order-stat-label">Pending</div>
              </div>
            </div>
            <div className="order-stat-item">
              <div className="order-stat-icon delivered">
                <TbTruckDelivery />
              </div>
              <div>
                <div className="order-stat-number">
                  {orders.filter((o: Order) => o.status === 'delivered').length}
                </div>
                <div className="order-stat-label">Delivered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="order-controls-status">

          <div className="filter-buttons-status">
            <button
              className={`filter-btn-status ${filterStatus === 'all' ? 'active-status' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              <FaHistory />
              All Orders
            </button>
            <button
              className={`filter-btn-status ${filterStatus === 'pending' ? 'active-status' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              <RiLoader2Line />
              Pending
            </button>
            <button
              className={`filter-btn-status ${filterStatus === 'completed' ? 'active-status' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              <RiCheckDoubleLine />
              Completed
            </button>
            <button
              className={`filter-btn-status ${filterStatus === 'delivered' ? 'active-status' : ''}`}
              onClick={() => setFilterStatus('delivered')}
            >
              <TbTruckDelivery />
              Delivered
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="order-status-content">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <GiKnifeFork />
              </div>
              <h3>No Orders Found</h3>
              <p>
                {searchTerm 
                  ? "No orders match your search criteria"
                  : filterStatus !== 'all'
                  ? `You have no ${filterStatus} orders`
                  : "Your order history is empty"}
              </p>
              {searchTerm && (
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="orders-grid-status">
              {filteredOrders.map((order: Order, index: number) => {
                const items: OrderProduct[] = order.items ?? order.products ?? [];
                const status = String(order.status).toLowerCase();
                const progress = getStatusProgress(status);
                const statusColor = getStatusColor(status);
                
                return (
                  <div 
                    className={`order-card-status ${activeOrder === order.id ? 'expanded' : ''}`}
                    key={order.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Card Header */}
                    <div 
                      className="order-card-header-status"
                      onClick={() => toggleOrderDetails(order.id.toString())}
                    >
                      <div className="order-basic-info-status">
                        <div className="order-avatar-status">
                          {getStatusIcon(status)}
                          <div 
                            className="status-indicator-status"
                            style={{ backgroundColor: statusColor }}
                          ></div>
                        </div>
                        <div>
                          <h3 className="order-title-status">
                            Order #{order.id ? String(order.id).slice(-8).toUpperCase() : "------"}
                          </h3>
                          <div className="order-meta-status">
                            <span className="customer-name-status">
                              <FaUser /> {order.user?.name || "You"}
                            </span>
                            <span className="order-date-status">
                              <FaCalendarAlt /> {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="order-status-display-status">
                        <div 
                          className="status-badge-status"
                          style={{ 
                            background: `linear-gradient(135deg, ${statusColor}, ${statusColor}dd)`,
                            color: 'white'
                          }}
                        >
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                        <div className="order-total-status">
                          ${order.total_price ? Number(order.total_price).toFixed(2) : "0.00"}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="order-progress">
                      <div className="progress-track">
                        <div 
                          className="progress-bar"
                          style={{ 
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${statusColor}, ${statusColor}cc)`
                          }}
                        ></div>
                      </div>
                      <div className="progress-steps">
                        <div className={`step ${progress >= 25 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-label">Ordered</span>
                        </div>
                        <div className={`step ${progress >= 50 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-label">Preparing</span>
                        </div>
                        <div className={`step ${progress >= 75 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-label">On the way</span>
                        </div>
                        <div className={`step ${progress >= 100 ? 'active' : ''}`}>
                          <div className="step-dot"></div>
                          <span className="step-label">Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <div className={`order-details-status ${activeOrder === order.id ? 'visible' : ''}`}>
                      {/* Delivery Information */}
                      <div className="details-section-status">
                        <h4>
                          <FaTruck className="section-icon-status" />
                          Delivery Information
                        </h4>
                        <div className="details-grid-status">
                          {order.shipping_address && (
                            <div className="detail-item-status">
                              <FaMapMarkerAlt className="detail-icon-status" />
                              <div>
                                <div className="detail-labe-statusl">Delivery Address</div>
                                <div className="detail-value-status">{order.shipping_address}</div>
                              </div>
                            </div>
                          )}
                          
                          {order.phone && (
                            <div className="detail-item-status">
                              <FaPhone className="detail-icon-status" />
                              <div>
                                <div className="detail-label-status">Contact Phone</div>
                                <div className="detail-value-status">{order.phone}</div>
                              </div>
                            </div>
                          )}
                          
                          {order.created_at && (
                            <div className="detail-item-status">
                              <FaClock className="detail-icon-status" />
                              <div>
                                <div className="detail-label-status">Order Time</div>
                                <div className="detail-value-status">
                                  {new Date(order.created_at).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="detail-item-status">
                            <FaMoneyBillWave className="detail-icon-status" />
                            <div>
                              <div className="detail-label-status">Payment Method</div>
                              <div className="detail-value-status">
                                <span className="payment-method-status">
                                  {order.payment_method || "Cash on Delivery"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="details-section-status">
                        <h4>
                          <MdOutlineRestaurantMenu className="section-icon-status" />
                          Order Items ({items.length})
                        </h4>
                        <div className="order-items-status">
                          {Array.isArray(items) && items.map((item: OrderProduct, idx: number) => (
                            <div className="order-item-status" key={item.id || idx}>
                              <div className="item-image-status">
                                <img
                                  src={`${API_ORIGIN}${item.product?.image || item.image || ''}`}
                                  alt={item.product?.name || item.name || `Item ${idx + 1}`}
                                  loading="lazy"
                                />
                                <div className="item-quantity-status">{item.quantity}x</div>
                              </div>
                              <div className="item-info-status">
                                <div className="item-name-status">
                                  {item.product?.name || item.name || `Item ${idx + 1}`}
                                </div>
                                <div className="item-description-status">
                                  {item.product?.description || item.description || ''}
                                </div>
                                <div className="item-meta-status">
                                  <div className="item-price-status">
                                    ${typeof item.price === 'number' 
                                      ? item.price.toFixed(2) 
                                      : typeof item.product?.price === 'number'
                                      ? item.product.price.toFixed(2)
                                      : '0.00'}
                                  </div>
                                  {item.product?.weight && (
                                    <div className="item-weight-status">
                                      • {item.product.weight}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="details-section notes">
                          <h4>
                            <FaCommentAlt className="section-icon" />
                            Special Instructions
                          </h4>
                          <div className="notes-content">{order.notes}</div>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="card-footer">
                      <button 
                        className="details-toggle"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {activeOrder === order.id ? 'Show Less' : 'View Details'}
                        <span className={`toggle-arrow ${activeOrder === order.id ? 'up' : ''}`}>
                          ▼
                        </span>
                      </button>
                    
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Timeline View */}
        {filteredOrders.length > 0 && (
          <div className="timeline-view">
            <h3>
              <FaHistory />
              Order Timeline
            </h3>
            <div className="timeline">
              {filteredOrders.slice(0, 5).map((order: Order) => (
                <div className="timeline-item" key={order.id}>
                  <div className="timeline-marker">
                    <div 
                      className="marker-dot"
                      style={{ backgroundColor: getStatusColor(String(order.status)) }}
                    ></div>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">
                      Order #{order.id ? String(order.id).slice(-6) : "------"}
                    </div>
                    <div className="timeline-details">
                      <span className="timeline-status" style={{ color: getStatusColor(String(order.status)) }}>
                        {String(order.status).toUpperCase()}
                      </span>
                      <span className="timeline-date">
                        {new Date(order.created_at || 0).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartStatus;