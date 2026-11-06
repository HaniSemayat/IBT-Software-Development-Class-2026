"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
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
      padding: [48, 48],
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

function getPointAtProgress(route, progress) {
  const segmentCount = route.length - 1;
  const scaledProgress = progress * segmentCount;
  const segmentIndex = Math.min(
    Math.floor(scaledProgress),
    segmentCount - 1
  );
  const segmentProgress = scaledProgress - segmentIndex;

  const start = route[segmentIndex];
  const end = route[segmentIndex + 1];

  return {
    lat: start.lat + (end.lat - start.lat) * segmentProgress,
    lng: start.lng + (end.lng - start.lng) * segmentProgress,
  };
}

export default function DeliveryMap({
  courier = DEFAULT_COURIER,
  destination = DEFAULT_DESTINATION,
}) {
  const [progress, setProgress] = useState(0);
  const [courierPosition, setCourierPosition] = useState(courier);

  const route = useMemo(() => {
    const latDifference = destination.lat - courier.lat;
    const lngDifference = destination.lng - courier.lng;

    return [
      courier,
      {
        lat: courier.lat + latDifference * 0.33 + 0.0005,
        lng: courier.lng + lngDifference * 0.33,
      },
      {
        lat: courier.lat + latDifference * 0.68 + 0.0005,
        lng: courier.lng + lngDifference * 0.68,
      },
      destination,
    ];
  }, [courier.lat, courier.lng, destination.lat, destination.lng]);

  useEffect(() => {
    setProgress(0);
    setCourierPosition(route[0]);

    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 1) {
          clearInterval(interval);
          return 1;
        }

        const next = Math.min(current + 0.0025, 1);
        setCourierPosition(getPointAtProgress(route, next));

        if (next >= 1) {
          clearInterval(interval);
        }

        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [route]);

  const courierIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `
          <span
            role="img"
            aria-label="Demo delivery motorcycle"
            style="
              display:flex;
              align-items:center;
              justify-content:center;
              width:42px;
              height:42px;
              border:3px solid white;
              border-radius:50%;
              background:#A94F36;
              box-shadow:0 3px 12px rgba(0,0,0,.28);
              font-size:23px;
            "
          >🛵</span>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
        popupAnchor: [0, -21],
      }),
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
    <div className="h-[360px] overflow-hidden rounded-2xl border border-border">
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

        <Polyline
          positions={route.map((point) => [point.lat, point.lng])}
          pathOptions={{
            color: "#A94F36",
            weight: 5,
            opacity: 0.8,
            dashArray: "8 10",
          }}
        />

        <Marker
          position={[courierPosition.lat, courierPosition.lng]}
          icon={courierIcon}
        >
          <Popup>🛵 Demo courier — simulated movement</Popup>
        </Marker>

        <Marker
          position={[destination.lat, destination.lng]}
          icon={destinationIcon}
        >
          <Popup>Delivery destination</Popup>
        </Marker>

        <FitDeliveryBounds courier={courier} destination={destination} />
      </MapContainer>
    </div>
  );
}
