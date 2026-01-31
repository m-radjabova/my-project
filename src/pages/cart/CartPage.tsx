import { FaShoppingCart, FaTrash, FaArrowLeft,  FaTag, FaTruck, FaCreditCard } from 'react-icons/fa';
import { IoBagCheckOutline } from 'react-icons/io5';
import useContextPro from '../../hooks/useContextPro';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/types';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useOrders } from '../../hooks/useOrders';
import { API_ORIGIN } from '../../utils';

function CartPage() {
    const { state: { cart }, dispatch } = useContextPro();
    const [isSaving, setIsSaving] = useState(false)
    const toNumber = (value: unknown) => {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    };
    const { createOrder } = useOrders();
    const formatMoney = (value: unknown) => toNumber(value).toFixed(2);

    const navigate = useNavigate();

    const deleteProduct = (cart : Product) => {
        if(cart.quantity === 1) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: cart.id });
        }else{
            dispatch({ type: 'DECREASE_QUANTITY', payload: cart.id });
        }
    }

  const totalPrice = cart.reduce(
    (total: number, item : Product) => total + toNumber(item.price) * toNumber(item.quantity ?? 1),
    0
  );

  const handleAddOrder = async () => {
    if (cart.length === 0) return;

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

      toast.success("Order created!");
      dispatch({ type: "CLEAR_CART" });
      navigate("/cart/order-status");
    } catch (e: unknown) {
      const message = isAxiosError(e)
        ? e.response?.data?.detail || "Failed to place order"
        : "Failed to place order";
      toast.error(message);
      console.error(e);
    }
  };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className='cart-page-title'>
                    <h1 >
                        <FaShoppingCart className="cart-title-icon" />
                        Shopping Cart
                    </h1>
                </div>
                
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <p>Your cart is feeling lonely 😔</p>
                        <div className='orders-btn'>
                            <button 
                            className="continue-shopping-btn"
                            onClick={ () => navigate('/') }
                            >
                                <FaArrowLeft className="btn-icon" />
                                Continue Shopping
                            </button>
                            <button 
                                onClick={ () => navigate('/cart/order-status') } 
                                className="order-status-btn"
                            >
                                <FaTag className="btn-icon" />
                                My orders status
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cart.map((item : Product) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img src={`${API_ORIGIN}${item.image}`} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h2 className="item-name">{item.name}</h2>
                                        <p className="item-description">{item.description}</p>
                                        <div className="price-container">
                                            <span className="current-price">${formatMoney(toNumber(item.price) * toNumber(item.quantity ?? 1))}</span>
                                            {toNumber(item.price * 2) > toNumber(item.price) && (
                                                <span className="old-price">${formatMoney(toNumber(item.price * 2) * toNumber(item.quantity ?? 1))}</span>
                                            )}
                                        </div>
                                        <div className="quantity-score">
                                            <button 
                                                className="remove-btn"
                                                onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                                            >
                                                <FaTrash className="btn-icon" />
                                                Remove
                                            </button>
                                            <div className="quantity-container">
                                                <button
                                                    className="quantity-add"
                                                    onClick={() => deleteProduct(item)}
                                                >-</button>
                                                <h2 className="quantity">
                                                    {item.quantity}
                                                </h2>
                                                <button
                                                    className="quantity-add"
                                                    onClick={() => dispatch({ type: "INCREASE_QUANTITY", payload: item.id })}
                                                >+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="cart-summary">
                            <div className="summary-card">
                                <h3>
                                    <IoBagCheckOutline className="summary-icon" />
                                    Order Summary
                                </h3>
                                <div className="summary-line">
                                    <span>Items ({cart.length})</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="summary-line total">
                                    <span>Total Amount</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="checkout-btn-container">
                                    <button
                                        className={`checkout-btn ${isSaving ? "saving" : ""}`}
                                        onClick={handleAddOrder}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="spinner"></div>
                                            </>
                                        ) : (
                                            <>
                                                <FaCreditCard className="btn-icon" />
                                                Order
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="checkout-btn"
                                        onClick={() => navigate('/cart/delivery')}
                                    >
                                        <FaTruck className="btn-icon" />
                                        Delivery
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage;
