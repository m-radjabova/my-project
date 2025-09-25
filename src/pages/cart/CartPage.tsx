import { FaShoppingCart, FaTrash, FaArrowLeft, FaTag } from 'react-icons/fa';
import { IoBagCheckOutline } from 'react-icons/io5';
import useContextPro from '../../hooks/useContextPro';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/types';
import useLoading from '../../hooks/useLoading';
import IsLoading from '../../components/IsLoading';

function CartPage() {
    const { loading } = useLoading();
    const { state: { cart }, dispatch } = useContextPro();
    const toNumber = (value: unknown) => {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    };

    const formatMoney = (value: unknown) => toNumber(value).toFixed(2);

    const totalPrice = cart.reduce((total, item) => total + toNumber(item.price) * toNumber(item.quantity ?? 1), 0);
    const totalSavings = cart.reduce((total, item) => total + (toNumber(item.oldPrice) - toNumber(item.price)) * toNumber(item.quantity ?? 1), 0);
    const navigate = useNavigate();

    const deleteProduct = (cart : Product) => {
        if(cart.quantity === 1) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: cart.id });
        }else{
            dispatch({ type: 'DECREASE_QUANTITY', payload: cart.id });
        }
    }

    if (loading) {
        return <IsLoading />;
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-page-title">
                    <h1>
                        <FaShoppingCart />
                        Shopping Cart
                    </h1>
                </div>
                
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <p>Your cart is feeling lonely 😔</p>
                        <button 
                            className="continue-shopping-btn"
                            onClick={ () => navigate('/') }
                        >
                            <FaArrowLeft className="btn-icon" />
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.imageUrl} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h2 className="item-name">{item.name}</h2>
                                        <p className="item-description">{item.description}</p>
                                        <div className="price-container">
                                            <span className="current-price">${formatMoney(toNumber(item.price) * toNumber(item.quantity ?? 1))}</span>
                                            {toNumber(item.oldPrice) > toNumber(item.price) && (
                                                <span className="old-price">${formatMoney(toNumber(item.oldPrice) * toNumber(item.quantity ?? 1))}</span>
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
                                                <span className="quantity">{item.quantity ?? 1}</span>
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
                                {totalSavings > 0 && (
                                    <div className="summary-line savings">
                                        <span>
                                            <FaTag className="savings-icon" />
                                            Savings
                                        </span>
                                        <span>-${totalSavings.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="summary-line total">
                                    <span>Total Amount</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <button className="checkout-btn">
                                    Order
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