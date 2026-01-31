import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationPicker({
  setSelectedLocation,
}: {
  setSelectedLocation: (loc: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

interface DeliveryFormValues {
  address: string;
  deliveryDate: string; 
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DeliveryFormValues>();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation((prev) => prev ?? { lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => {
    if (cart.length === 0) {
      toast.info("Cart is empty");
      return;
    }
    setIsModalOpen(true);
  };

  const onSubmit: SubmitHandler<DeliveryFormValues> = async (data) => {
    if (cart.length === 0) return;

    if (!selectedLocation) {
      toast.error("Please select a location from the map!");
      return;
    }

    const phone = phoneNumber.trim();
    if (!phone) {
      toast.error("Please enter phone number");
      return;
    }

    try {
      setIsSaving(true);

      const notesMerged = [
        data.notes?.trim(),
        data.deliveryDate ? `Delivery date: ${data.deliveryDate}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const payload = {
        payment_method: "cash",
        shipping_address: data.address,
        phone,
        notes: notesMerged,
        location: selectedLocation,
        items: cart.map((item: Product) => ({
          product_id: String(item.id),
          quantity: Number(item.quantity ?? 1),
        })),
      };

      await createOrder(payload);

      toast.success("Order created!");
      dispatch({ type: "CLEAR_CART" });
      reset();
      setPhoneNumber("");
      setIsModalOpen(false);
      navigate("/cart/order-status");
    } catch (e: unknown) {
      const error = e as { response?: { data?: { detail?: string } } };
      toast.error(error?.response?.data?.detail || "Failed to place order");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="delivery-page">
      <div className="delivery-container">
        <div className="delivery-header">
          <h1>📍 Delivery Information</h1>
          <p className="subtitle">Fill in the following information to complete your order</p>
        </div>

        <div className="delivery-content">
          <div className="map-section">
            <h2>Select Location on Map</h2>
            <p className="map-instruction">Click on the map to mark your delivery location</p>

            <div className="map-container">
              <MapContainer
                center={
                  selectedLocation
                    ? [selectedLocation.lat, selectedLocation.lng]
                    : [41.3111, 69.2797]
                }
                zoom={12}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {selectedLocation && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lng]}
                    icon={customIcon}
                  />
                )}

                <LocationPicker setSelectedLocation={setSelectedLocation} />
                <LocateControl setSelectedLocation={setSelectedLocation} />
              </MapContainer>
            </div>

            {selectedLocation && (
              <div className="selected-location">
                <span className="location-icon">📍</span>
                <span>
                  Selected location: {selectedLocation.lat.toFixed(5)},{" "}
                  {selectedLocation.lng.toFixed(5)}
                </span>
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>Delivery Details</h2>

            {/* MUHIM: form submitni modal tugmasidan handleSubmit orqali yuboryapmiz */}
            <form className="delivery-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Delivery Address
                </label>
                <input
                  id="address"
                  className={`form-control ${errors.address ? "error" : ""}`}
                  type="text"
                  placeholder="Enter your complete address"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address && <p className="error-message">{errors.address.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="deliveryDate" className="form-label">
                  Delivery Date
                </label>
                <input
                  id="deliveryDate"
                  className={`form-control ${errors.deliveryDate ? "error" : ""}`}
                  type="date"
                  {...register("deliveryDate", { required: "Delivery date is required" })}
                />
                {errors.deliveryDate && (
                  <p className="error-message">{errors.deliveryDate.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  className="form-control"
                  placeholder="Write any additional requirements or comments..."
                  rows={4}
                  {...register("notes")}
                />
              </div>

              <button
                type="button"
                onClick={handleOpenModal}
                className="delivery-checkout-btn"
                disabled={isSaving}
              >
                {isSaving ? "Placing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <UseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Confirm Order"
        size="md"
      >
        <div className="modal-content">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="form-control"
          />

          <div className="d-flex gap-2">
            <button
              type="button"
              className="delivery-checkout-btn"
              onClick={handleCloseModal}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="button"
              className="delivery-checkout-btn"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving ? "Placing Order..." : "Confirm"}
            </button>
          </div>
        </div>
      </UseModal>
    </div>
  );
}

export default DeliveryPage;