import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import useContextPro from "../../hooks/useContextPro";
import { useForm, type SubmitHandler } from "react-hook-form";
import LocateControl from "./LocationMarker";
import UseModal from "../../hooks/UseModal";
import { toast } from "react-toastify";
import { useOrders } from "../../hooks/useOrders";
import type { Product } from "../../types/types";
import { FaMapMarkerAlt, FaCalendarAlt, FaHome, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineClipboardList, HiOutlinePhone } from "react-icons/hi";
import { RiMapPinTimeLine, RiSecurePaymentLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";

const deliveryIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [38, 62],
  iconAnchor: [19, 62],
  popupAnchor: [0, -62],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function LocationPicker({
  setSelectedLocation,
}: {
  setSelectedLocation: (loc: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      toast.info("📍 Location selected!", {
        position: "top-right"
      });
    },
  });
  return null;
}

function MapAnimator({ location }: { location: { lat: number; lng: number } | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 15, {
        duration: 1.5,
      });
    }
  }, [location, map]);

  return null;
}

interface DeliveryFormValues {
  address: string;
  deliveryDate: string; 
  deliveryTime: string;
  notes: string;
}

function DeliveryPage() {
  const {
    state: { cart },
    dispatch,
  } = useContextPro();

  const navigate = useNavigate();
  const { createOrder } = useOrders();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState<"standard" | "express">("standard");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm<DeliveryFormValues>({
    mode: "onChange"
  });

  const deliveryDate = watch("deliveryDate");

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.info("📍 Please enable location services for better experience");
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setSelectedLocation((prev) => prev ?? { lat: latitude, lng: longitude });
            resolve("Location detected!");
          },
          (error) => {
            console.error("Geolocation error:", error);
            reject("Could not detect location");
          }
        );
      }),
      {
        pending: "Detecting your location...",
        success: "📍 Location detected!",
        error: "Could not detect location"
      }
    );
  }, []);

  const steps = [
    { number: 1, label: "Location", icon: <FaMapMarkerAlt /> },
    { number: 2, label: "Details", icon: <HiOutlineClipboardList /> },
    { number: 3, label: "Confirm", icon: <FaCheckCircle /> },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPhoneNumber("");
  };

  const handleOpenModal = () => {
    if (cart.length === 0) {
      toast.info("🛒 Your cart is empty!");
      return;
    }
    if (!isValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    setIsModalOpen(true);
    setCurrentStep(3);
  };

  const calculateDeliveryFee = () => {
    return deliveryType === "express" ? 9.99 : 4.99;
  };

  const calculateEstimatedDelivery = () => {
    if (deliveryType === "express") {
      return "30-45 minutes";
    }
    return "60-90 minutes";
  };

  const onSubmit: SubmitHandler<DeliveryFormValues> = async (data) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please select a location on the map!");
      return;
    }

    const phone = phoneNumber.trim();
    const phoneRegex = /^[+]?[1-9][\d]{1,14}$/;
    
    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }
    
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setIsSaving(true);

      const notesMerged = [
        data.notes?.trim(),
        `Delivery date: ${data.deliveryDate}`,
        data.deliveryTime && `Time: ${data.deliveryTime}`,
        `Delivery type: ${deliveryType}`
      ]
        .filter(Boolean)
        .join(" | ");

      const payload = {
        payment_method: "cash",
        shipping_address: data.address,
        phone,
        notes: notesMerged,
        location: selectedLocation,
        delivery_type: deliveryType,
        delivery_fee: calculateDeliveryFee(),
        items: cart.map((item: Product) => ({
          product_id: String(item.id),
          quantity: Number(item.quantity ?? 1),
        })),
      };

      await createOrder(payload);

      toast.success(
        <div className="toast-success">
          <FaCheckCircle className="success-icon" />
          <div>
            <div className="success-title">Order Confirmed! 🎉</div>
            <div className="success-subtitle">Estimated delivery: {calculateEstimatedDelivery()}</div>
          </div>
        </div>,
        {
          autoClose: 4000,
        }
      );
      
      dispatch({ type: "CLEAR_CART" });
      reset();
      setPhoneNumber("");
      setIsModalOpen(false);
      
      setTimeout(() => {
        navigate("/cart/order-status");
      }, 2000);
    } catch (e: unknown) {
      const error = e as { response?: { data?: { detail?: string } } };
      toast.error(error?.response?.data?.detail || "Failed to place order. Please try again.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="delivery-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-shape shape-4"></div>
      </div>

      <div className="delivery-container">
        {/* Header */}
        <div className="delivery-header">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Back to Cart
          </button>
          
          <div className="header-content">
            <div className="header-icon">
              <TbTruckDelivery />
            </div>
            <div>
              <h1>Delivery Details</h1>
              <p className="subtitle">Complete your delivery information to finalize order</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className={`step ${currentStep >= step.number ? "active" : ""} ${currentStep === step.number ? "current" : ""}`}
              onClick={() => setCurrentStep(step.number)}
            >
              <div className="step-number">
                {currentStep > step.number ? <FaCheckCircle /> : step.number}
              </div>
              <div className="step-label">
                {step.label}
                {step.number === currentStep && <div className="step-pulse"></div>}
              </div>
            </div>
          ))}
          <div className="step-line"></div>
        </div>

        <div className="delivery-content">
          {/* Map Section */}
          <div className={`map-section ${currentStep === 1 ? "active" : ""}`}>
            <div className="section-header">
              <HiOutlineLocationMarker className="section-icon" />
              <div>
                <h2>Select Delivery Location</h2>
                <p className="section-subtitle">Click on the map to pinpoint your exact delivery location</p>
              </div>
            </div>

            <div className="map-wrapper">
              <div className="map-container">
                <MapContainer
                  center={
                    selectedLocation
                      ? [selectedLocation.lat, selectedLocation.lng]
                      : [41.3111, 69.2797]
                  }
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {selectedLocation && (
                    <Marker
                      position={[selectedLocation.lat, selectedLocation.lng]}
                      icon={deliveryIcon}
                    />
                  )}

                  <LocationPicker setSelectedLocation={setSelectedLocation} />
                  <LocateControl setSelectedLocation={setSelectedLocation} />
                  <MapAnimator location={selectedLocation} />
                </MapContainer>
                
                <div className="map-controls">
                  <button 
                    className="map-control-btn"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setSelectedLocation({
                              lat: pos.coords.latitude,
                              lng: pos.coords.longitude
                            });
                          },
                          (err) => toast.error("Could not get location")
                        );
                      }
                    }}
                  >
                    <FaMapMarkerAlt />
                    My Location
                  </button>
                </div>
              </div>

              {selectedLocation && (
                <div className="selected-location-card">
                  <div className="location-pin">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="location-details">
                    <div className="location-title">Selected Location</div>
                    <div className="location-coords">
                      {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                    </div>
                  </div>
                  <div className="location-accuracy">
                    <span className="accuracy-dot"></span>
                    High Accuracy
                  </div>
                </div>
              )}
            </div>
            
            {currentStep === 1 && (
              <button 
                className="next-step-btn"
                onClick={() => setCurrentStep(2)}
                disabled={!selectedLocation}
              >
                Continue to Details
                <span className="btn-arrow">→</span>
              </button>
            )}
          </div>

          {/* Form Section */}
          <div className={`form-section ${currentStep === 2 ? "active" : ""}`}>
            <div className="section-header">
              <HiOutlineClipboardList className="section-icon" />
              <div>
                <h2>Delivery Information</h2>
                <p className="section-subtitle">Fill in your delivery details</p>
              </div>
            </div>

            <div className="form-wrapper">
              <form className="delivery-form" onSubmit={(e) => e.preventDefault()}>
                {/* Delivery Type Selection */}
                <div className="delivery-type-selection">
                  <h3>Delivery Speed</h3>
                  <div className="type-options">
                    <div 
                      className={`type-option ${deliveryType === "standard" ? "selected" : ""}`}
                      onClick={() => setDeliveryType("standard")}
                    >
                      <div className="option-icon">🚚</div>
                      <div className="option-content">
                        <div className="option-title">Standard Delivery</div>
                        <div className="option-subtitle">60-90 minutes</div>
                        <div className="option-price">$4.99</div>
                      </div>
                      {deliveryType === "standard" && <div className="option-check"><FaCheckCircle /></div>}
                    </div>
                    
                    <div 
                      className={`type-option ${deliveryType === "express" ? "selected" : ""}`}
                      onClick={() => setDeliveryType("express")}
                    >
                      <div className="option-icon">⚡</div>
                      <div className="option-content">
                        <div className="option-title">Express Delivery</div>
                        <div className="option-subtitle">30-45 minutes</div>
                        <div className="option-price">$9.99</div>
                      </div>
                      {deliveryType === "express" && <div className="option-check"><FaCheckCircle /></div>}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="form-fields">
                  <div className="form-group">
                    <label htmlFor="address" className="form-label">
                      <FaHome className="label-icon" />
                      Delivery Address
                    </label>
                    <input
                      id="address"
                      className={`form-control ${errors.address ? "error" : ""}`}
                      type="text"
                      placeholder="Enter your complete address with apartment/unit number"
                      {...register("address", { 
                        required: "Address is required",
                        minLength: { value: 10, message: "Address is too short" }
                      })}
                    />
                    {errors.address && <p className="error-message">{errors.address.message}</p>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="deliveryDate" className="form-label">
                        <FaCalendarAlt className="label-icon" />
                        Delivery Date
                      </label>
                      <input
                        id="deliveryDate"
                        className={`form-control ${errors.deliveryDate ? "error" : ""}`}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register("deliveryDate", { 
                          required: "Delivery date is required"
                        })}
                      />
                      {errors.deliveryDate && <p className="error-message">{errors.deliveryDate.message}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="deliveryTime" className="form-label">
                        <RiMapPinTimeLine className="label-icon" />
                        Preferred Time
                      </label>
                      <select
                        id="deliveryTime"
                        className="form-control"
                        {...register("deliveryTime")}
                      >
                        <option value="">Select time</option>
                        <option value="09:00-12:00">Morning (9:00 AM - 12:00 PM)</option>
                        <option value="12:00-15:00">Afternoon (12:00 PM - 3:00 PM)</option>
                        <option value="15:00-18:00">Evening (3:00 PM - 6:00 PM)</option>
                        <option value="18:00-21:00">Night (6:00 PM - 9:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes" className="form-label">
                      <HiOutlineClipboardList className="label-icon" />
                      Special Instructions
                    </label>
                    <textarea
                      id="notes"
                      className="form-control"
                      placeholder="Any special delivery instructions? (e.g., gate code, leave at door, call on arrival...)"
                      rows={4}
                      {...register("notes")}
                    />
                    <div className="char-count">Optional</div>
                  </div>
                </div>

                {/* Order Summary Preview */}
                <div className="order-preview">
                  <h3>Order Summary</h3>
                  <div className="preview-content">
                    <div className="preview-row">
                      <span>Items ({cart.length})</span>
                      <span>${cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2)}</span>
                    </div>
                    <div className="preview-row">
                      <span>Delivery Fee</span>
                      <span>${calculateDeliveryFee().toFixed(2)}</span>
                    </div>
                    <div className="preview-divider"></div>
                    <div className="preview-row total">
                      <span>Total Amount</span>
                      <span>
                        ${(cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) + calculateDeliveryFee()).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button"
                    className="prev-step-btn"
                    onClick={() => setCurrentStep(1)}
                  >
                    <span className="btn-arrow">←</span>
                    Back to Map
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="delivery-checkout-btn"
                    disabled={isSaving || !isValid}
                  >
                    <RiSecurePaymentLine className="btn-icon" />
                    {isSaving ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <UseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title=""
        size="md"
      >
        <div className="confirmation-modal">
          <div className="modal-header">
            <div className="modal-icon">
              <RiSecurePaymentLine />
            </div>
            <h3>Confirm Your Order</h3>
            <p className="modal-subtitle">Please verify your details before confirming</p>
          </div>

          <div className="modal-content">
            <div className="phone-input-group">
              <HiOutlinePhone className="input-icon" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="phone-input"
                maxLength={20}
              />
              <div className="input-hint">For delivery updates</div>
            </div>

            <div className="order-summary-modal">
              <div className="summary-item">
                <span>Delivery Address</span>
                <span>{watch("address") || "Not specified"}</span>
              </div>
              <div className="summary-item">
                <span>Delivery Date</span>
                <span>{deliveryDate || "Not specified"}</span>
              </div>
              <div className="summary-item">
                <span>Delivery Type</span>
                <span className={`type-tag ${deliveryType}`}>
                  {deliveryType === "express" ? "⚡ Express" : "🚚 Standard"}
                </span>
              </div>
              <div className="summary-item">
                <span>Estimated Time</span>
                <span>{calculateEstimatedDelivery()}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-btn secondary"
                onClick={handleCloseModal}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="modal-btn primary"
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving || !phoneNumber.trim()}
              >
                {isSaving ? (
                  <>
                    <span className="spinner"></span>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Confirm & Place Order
                  </>
                )}
              </button>
            </div>

            <div className="security-note">
              <div className="security-icon">🔒</div>
              <p>Secure transaction · Your payment information is encrypted</p>
            </div>
          </div>
        </div>
      </UseModal>
    </div>
  );
}

export default DeliveryPage;