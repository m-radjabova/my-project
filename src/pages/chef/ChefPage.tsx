import { useOrders } from "../../hooks/useOrders";
import { LuChefHat } from "react-icons/lu";
import { FaMapMarkerAlt, FaMoneyBillWave, FaUser } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { useState } from "react";

function ChefPage() {
    const { orders } = useOrders();
    const [filterStatus, setFilterStatus] = useState("all");

    const filteredOrders = filterStatus === "all" 
        ? orders 
        : orders.filter(order => order.status === filterStatus);

    const getStatusBadgeClass = (status: string) => {
        switch(status.toLowerCase()) {
            case "pending": return "status-badge status-pending";
            case "completed": return "status-badge status-completed";
            default: return "status-badge";
        }
    };
    return (
        <div className="chef-page">
            <div className="chef-page-header">
                <div className="chef-page-title">
                    <div className="title-container">
                        <LuChefHat className="chef-icon" />
                        <div>
                            <h1>Chef's Kitchen</h1>
                            <p>Manage your orders efficiently</p>
                        </div>
                    </div>
                    <div className="orders-count">
                        <span className="count-number">{filteredOrders.length}</span>
                        <span>order{filteredOrders.length !== 1 ? 's' : ''} pending</span>
                    </div>
                </div>
                <div className="status-filter">
                    <button 
                        className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        All Orders
                    </button>
                    <button 
                        className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('pending')}
                    >
                        Pending
                    </button>
                    <button 
                        className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('completed')}
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
                            {filteredOrders.map((order) => (
                                <div className="order-card" key={order.id}>
                                    {/* Order Header */}
                                    <div className="order-header">
                                        <div className="order-customer">
                                            <div className="customer-avatar">
                                                <FaUser className="customer-icon" />
                                            </div>
                                            <div>
                                                <h3>{order.user.name}</h3>
                                                <span className="order-id">Order #{order.id.slice(-6)}</span>
                                            </div>
                                        </div>
                                        <div className={getStatusBadgeClass(order.status)}>
                                            {order.status}
                                        </div>
                                    </div>
                                    <div className="order-details">
                                        <div className="detail-item">
                                            <FaMapMarkerAlt className="detail-icon" />
                                            <span className="address-text">{order.shippingAddress}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FaMoneyBillWave className="detail-icon" />
                                            <span>${order.totalPrice.toFixed(2)} • {order.paymentMethod}</span>
                                        </div>
                                    </div>
                                    <div className="order-products">
                                        <h4>Order Items ({order.products.length})</h4>
                                        <div className="chef-product-cards">
                                            {order.products.map((product, index) => (
                                                <div className="chef-product-card" key={index}>
                                                    <div className="chef-product-image-container">
                                                        <img 
                                                            className="chef-product-image" 
                                                            src={product.imageUrl || "/api/placeholder/60/60"} 
                                                            alt={product.name} 
                                                        />
                                                    </div>
                                                    <div className="product-info">
                                                        <div className="product-header">
                                                            <span className="chef-product-quantity">{product.quantity}x</span>
                                                            <span className="chef-product-name">{product.name || `Product ${index + 1}`}</span>
                                                        </div>
                                                        <div className="product-details">
                                                            {product.description && (
                                                                <span className="chef-product-description">{product.description}</span>
                                                            )}
                                                            <div className="product-meta">
                                                                <span className="chef-product-price">${product.price?.toFixed(2) || '0.00'}</span>
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
                                        <button className="action-btn update-btn">
                                            Done Cooking
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChefPage;