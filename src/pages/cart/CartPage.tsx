import { FaShoppingCart, FaTrash, FaArrowLeft, FaTag, FaTruck, FaCreditCard, FaTimes } from 'react-icons/fa';
import { IoBagCheckOutline } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi';
import useContextPro from '../../hooks/useContextPro';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/types';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useOrders } from '../../hooks/useOrders';
import { API_ORIGIN } from '../../utils';
import { BiSolidCoupon } from 'react-icons/bi';

function CartPage() {
    const { state: { cart }, dispatch } = useContextPro();
    const [isSaving, setIsSaving] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [showCoupon, setShowCoupon] = useState(false);
    const [discount, setDiscount] = useState(0);
    

    const toNumber = (value: unknown) => {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    };
    
    const { createOrder } = useOrders();
    const formatMoney = (value: unknown) => toNumber(value).toFixed(2);

    const navigate = useNavigate();

    const deleteProduct = (product: Product) => {
        if(product.quantity === 1) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: product.id });
            toast.info(`🗑️ ${product.name} removed from cart`, {
                position: "bottom-right"
            });
        } else {
            dispatch({ type: 'DECREASE_QUANTITY', payload: product.id });
        }
    }


    const applyCoupon = () => {
        if (coupon.toLowerCase() === 'spring20') {
            setDiscount(20);
            toast.success("🎉 20% discount applied!");
            setCoupon('');
            setShowCoupon(false);
        } else if (coupon.toLowerCase() === 'welcome10') {
            setDiscount(10);
            toast.success("🎉 10% discount applied!");
            setCoupon('');
            setShowCoupon(false);
        } else {
            toast.error("Invalid coupon code");
        }
    }

    const totalPrice = cart.reduce(
        (total: number, item: Product) => total + toNumber(item.price) * toNumber(item.quantity ?? 1),
        0
    );

    const discountAmount = (totalPrice * discount) / 100;
    const finalPrice = totalPrice - discountAmount;

    const handleAddOrder = async () => {
        if (cart.length === 0) return;
        setIsSaving(true);

        try {
            const payload = {
                payment_method: "cash",
                shipping_address: "", 
                phone: "",           
                notes: "",
                location: null,
                items: cart.map((item: Product) => ({
                    product_id: String(item.id),
                    quantity: Number(item.quantity ?? 1),
                })),
            };

            await createOrder(payload);

            toast.success(
                <div>
                    <div className="toast-success-title">🎊 Order Confirmed!</div>
                    <div className="toast-success-subtitle">Your items are being prepared</div>
                </div>,
                {
                    autoClose: 3000,
                }
            );
            
            dispatch({ type: "CLEAR_CART" });
            setTimeout(() => {
                navigate("/cart/order-status");
            }, 1500);
        } catch (e: unknown) {
            const message = isAxiosError(e)
                ? e.response?.data?.detail || "Failed to place order"
                : "Failed to place order";
            toast.error(message);
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className='cart-header'>
                    <button 
                        className="back-button"
                        onClick={() => navigate('/')}
                    >
                        <FaArrowLeft />
                        Back to Shop
                    </button>
                    
                    <div className="cart-title-wrapper">
                        <div className="title-sparkle">
                            <HiOutlineSparkles className="sparkle-icon" />
                        </div>
                        <h1>
                            <FaShoppingCart className="cart-title-icon" />
                            Your Shopping Cart
                            <span className="cart-count">{cart.length} items</span>
                        </h1>
                        <div className="title-sparkle">
                            <HiOutlineSparkles className="sparkle-icon" />
                        </div>
                    </div>
                </div>
                
                {cart.length === 0 ? (
                    <div className="empty-cart-state">
                        <div className="empty-cart-animation">
                            <div className="cart-icon-wrapper">
                                <FaShoppingCart className="cart-icon" />
                            </div>
                            <div className="floating-dots">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any items yet</p>
                        <div className="empty-cart-actions">
                            <button 
                                className="primary-btn"
                                onClick={() => navigate('/')}
                            >
                                <HiOutlineSparkles className="btn-icon" />
                                Start Shopping
                            </button>
                            <button 
                                className="secondary-btn"
                                onClick={() => navigate('/cart/order-status')}
                            >
                                <FaTag className="btn-icon" />
                                View Orders
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="cart-content-layout">
                        <div className="cart-items-section">
                            <div className="section-header">
                                <h2>Cart Items</h2>
                                <button 
                                    className="clear-cart-btn"
                                    onClick={() => {
                                        dispatch({ type: "CLEAR_CART" });
                                        toast.info("Cart cleared");
                                    }}
                                >
                                    <FaTimes /> Clear All
                                </button>
                            </div>
                            
                            <div className="items-grid">
                                {cart.map((item: Product) => (
                                    <div key={item.id} className="cart-item-card">
                                        <div className="item-image-wrapper">
                                            <img 
                                                src={`${API_ORIGIN}${item.image}`} 
                                                alt={item.name}
                                                loading="lazy"
                                                onLoad={(e) => e.currentTarget.classList.add('loaded')}
                                            />
                                            <div className="image-overlay"></div>
                                            {toNumber(item.price * 1.5) > toNumber(item.price) && (
                                                <div className="discount-badge">
                                                    Save ${formatMoney(toNumber(item.price) * 1.5 - toNumber(item.price))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="item-info">
                                            <div className="item-header">
                                                <h3 className="item-name">{item.name}</h3>
                                                <button 
                                                    className="remove-item-btn"
                                                    onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            
                                            <p className="item-description">{item.description}</p>
                                            
                                            <div className="item-footer">
                                                <div className="price-section">
                                                    <div className="current-price">${formatMoney(toNumber(item.price) * toNumber(item.quantity ?? 1))}</div>
                                                    <div className="price-unit">${formatMoney(item.price)} each</div>
                                                </div>
                                                
                                                <div className="quantity-controls">
                                                    <button
                                                        className="quantity-btn decrease"
                                                        onClick={() => deleteProduct(item)}
                                                    >
                                                        −
                                                    </button>
                                                    <div className="quantity-display">
                                                        <span>{item.quantity}</span>
                                                    </div>
                                                    <button
                                                        className="quantity-btn increase"
                                                        onClick={() => dispatch({ type: "INCREASE_QUANTITY", payload: item.id })}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="order-summary-section">
                            <div className="summary-card">
                                <div className="summary-header">
                                    <IoBagCheckOutline className="summary-icon" />
                                    <h3>Order Summary</h3>
                                </div>
                                
                                <div className="summary-content">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="summary-row">
                                        <span>Shipping</span>
                                        <span className="free">FREE</span>
                                    </div>
                                    
                                    {discount > 0 && (
                                        <div className="summary-row discount">
                                            <span>Discount ({discount}%)</span>
                                            <span className="discount-amount">-${discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    {!showCoupon ? (
                                        <button 
                                            className="coupon-toggle-btn"
                                            onClick={() => setShowCoupon(true)}
                                        >
                                            <BiSolidCoupon className="coupon-icon" />
                                            Apply Coupon Code
                                        </button>
                                    ) : (
                                        <div className="coupon-input-group">
                                            <input
                                                type="text"
                                                placeholder="Enter coupon code"
                                                value={coupon}
                                                onChange={(e) => setCoupon(e.target.value)}
                                                className="coupon-input"
                                            />
                                            <button 
                                                className="apply-coupon-btn"
                                                onClick={applyCoupon}
                                            >
                                                Apply
                                            </button>
                                            <button 
                                                className="cancel-coupon-btn"
                                                onClick={() => {
                                                    setShowCoupon(false);
                                                    setCoupon('');
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="divider"></div>
                                    
                                    <div className="summary-row total">
                                        <span>Total Amount</span>
                                        <div className="total-amount">
                                            <span className="amount">${finalPrice.toFixed(2)}</span>
                                            {discount > 0 && (
                                                <span className="original-amount">${totalPrice.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="summary-actions">
                                    <button
                                        className={`checkout-btn ${isSaving ? "saving" : ""}`}
                                        onClick={handleAddOrder}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="spinner"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <FaCreditCard className="btn-icon" />
                                                Proceed to Checkout
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        className="delivery-btn"
                                        onClick={() => navigate('/cart/delivery')}
                                    >
                                        <FaTruck className="btn-icon" />
                                        Delivery Options
                                    </button>
                                </div>
                                
                                <div className="security-note">
                                    <div className="lock-icon">🔒</div>
                                    <p>Secure checkout · Your payment information is encrypted</p>
                                </div>
                            </div>
                            
                            <div className="recommendation-card">
                                <h4>You might also like</h4>
                                <p>Add more items to get free shipping!</p>
                                <button 
                                    className="browse-btn"
                                    onClick={() => navigate('/')}
                                >
                                    Browse Products
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage;