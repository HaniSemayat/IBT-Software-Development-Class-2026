"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

const DEFAULT_COURIER = {
  lat: 9.0192,
  lng: 38.7525,
};

const DEFAULT_DESTINATION = {
  lat: 9.0054,
  lng: 38.7636,
};

function FitDeliveryBounds({ courier, destination }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [courier.lat, courier.lng],
      [destination.lat, destination.lng]
    );

    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: 15,
    });
  }, [map, courier.lat, courier.lng, destination.lat, destination.lng]);

  return null;
}

function createMarkerIcon(className, label) {
  return L.divIcon({
    className: "delivery-map-marker-wrapper",
    html: `<span class="${className}" role="img" aria-label="${label}"></span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

export default function DeliveryMap({
  courier = DEFAULT_COURIER,
  destination = DEFAULT_DESTINATION,
}) {
  const courierIcon = useMemo(
    () =>
      createMarkerIcon(
        "delivery-map-marker delivery-map-courier",
        "Demo courier"
      ),
    []
  );

  const destinationIcon = useMemo(
    () =>
      createMarkerIcon(
        "delivery-map-marker delivery-map-destination",
        "Delivery destination"
      ),
    []
  );

  return (
    <div className="h-[360px] overflow-hidden rounded-xl border border-gray-200">
      <MapContainer
        center={[destination.lat, destination.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[courier.lat, courier.lng]}
          icon={courierIcon}
        >
          <Popup>Demo courier location (sample only)</Popup>
        </Marker>

        <Marker
          position={[destination.lat, destination.lng]}
          icon={destinationIcon}
        >
          <Popup>Delivery destination (sample only)</Popup>
        </Marker>

        <FitDeliveryBounds courier={courier} destination={destination} />
      </MapContainer>
    </div>
  );
}
