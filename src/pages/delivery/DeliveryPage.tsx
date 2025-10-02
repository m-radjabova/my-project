import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { addDoc, collection } from "firebase/firestore";
import {db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import useContextPro from "../../hooks/useContextPro";
import { useForm, type SubmitHandler } from "react-hook-form";
import LocateControl from "./LocationMarker";
import UseModal from "../../hooks/UseModal";

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
    formState: { errors },
  } = useForm<DeliveryFormValues>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation(
            (prev) => prev ?? { lat: latitude, lng: longitude }
          );
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);

  const onSubmit: SubmitHandler<DeliveryFormValues> = async (data) => {
    if (!selectedLocation) {
      alert("Please select a location from the map!");
      return;
    }
    if (cart.length === 0) return;
    if (!phoneNumber) {
      alert("Please enter phone number");
      return;
    }

    try {
      setIsSaving(true);
      const auth = getAuth();
      const userId = auth.currentUser?.uid || "";

      const orderRef = await addDoc(collection(db, "orders"), {
        userId,
        totalPrice: cart.reduce(
          (t, i) => t + Number(i.price) * Number(i.quantity ?? 1),
          0 as number
        ),
        createdAt: new Date(),
        status: "pending",
        paymentMethod: "cash",
        phone: phoneNumber,
        shippingAddress: data.address,
        notes: data.notes,
        deliveryDate: data.deliveryDate,
        location: selectedLocation,
      });

      for (const item of cart) {
        await addDoc(collection(db, "orders", orderRef.id, "orderProducts"), {
          productId: String(item.id ?? ""),
          name: String(item.name ?? ""),
          imageUrl: item.imageUrl ?? "",
          description: String(item.description ?? ""),
          weight: String(item.weight ?? ""),
          price: Number(item.price),
          quantity: Number(item.quantity ?? 1),
          totalPrice: Number(item.price) * Number(item.quantity ?? 1),
          createdAt: new Date(),
        });
      }

      dispatch({ type: "CLEAR_CART" });
      reset();
      setPhoneNumber("");
      navigate("/cart/order-status");
    } catch (err) {
      console.error("Error saving order:", err);
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="delivery-page">
      <div className="delivery-container">
        <div className="delivery-header">
          <h1>📍 Delivery Information</h1>
          <p className="subtitle">
            Fill in the following information to complete your order
          </p>
        </div>

        <div className="delivery-content">
          <div className="map-section">
            <h2>Select Location on Map</h2>
            <p className="map-instruction">
              Click on the map to mark your delivery location
            </p>

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

            <form className="delivery-form">
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
                {errors.address && (
                  <p className="error-message">{errors.address.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="deliveryDate" className="form-label">
                  Delivery Date
                </label>
                <input
                  id="deliveryDate"
                  className={`form-control ${
                    errors.deliveryDate ? "error" : ""
                  }`}
                  type="date"
                  {...register("deliveryDate", {
                    required: "Delivery date is required",
                  })}
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
                Place Order
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
          <input type="phone" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="Enter your phone number"
            className="form-control"
          />
          <div className="d-flex  gap-2">
            <button 
              className="delivery-checkout-btn"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              className="delivery-checkout-btn"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </UseModal>
    </div>
  );
}

export default DeliveryPage;
