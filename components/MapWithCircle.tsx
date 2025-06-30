'use client';
import { Box } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
};

const center = {
  lat: -34.0347,  // Updated to South Village, 2 Kiln Rd, Kirrawee NSW 2232 (Pickup and Dropoff only)
  lng: 151.0702
};

const circleOptions = {
  strokeColor: '#c9a227',   // brand gold color
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#c9a227',
  fillOpacity: 0.2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 1000,  // radius in meters
  zIndex: 1
};

export default function MapWithCircle() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        <Circle center={center} options={circleOptions} />
      </GoogleMap>
    </LoadScript>
  );
}
