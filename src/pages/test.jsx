// import React from "react";
// import { GoogleMap, LoadScript } from "@react-google-maps/api";

// const containerStyle = {
//   width: "100%",
//   height: "100%",
// };

// const center = {
//   lat: 23.8041,
//   lng: 90.4152,
// };

// function MyMapComponent() {
//   return (
//     <LoadScript googleMapsApiKey="AIzaSyC2qBiJzOitO345ed0T-BAVgnM0XRnOH8g">
//       <div className="w-full h-[100vh]">
//         <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
//           {/* Child components, such as markers, info windows, etc. */}
//         </GoogleMap>
//       </div>
//     </LoadScript>
//   );
// }

// export default React.memo(MyMapComponent);

/*Functionality 1: 
                    a) Upon click, get the latitude and longitude of that location
                    b) After receiving that latitude and longitude, get the address of that location

Status: Working
*/
// import React, { useCallback, useState, useRef } from 'react';
// import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// const center = { lat: 23.764424, lng: 90.429645 };

// function MapComponent() {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: "AIzaSyC2qBiJzOitO345ed0T-BAVgnM0XRnOH8g", // Replace with your actual API key
//     libraries: ["places"],
//   });

//   const [map, setMap] = useState(null);
//   const mapRef = useRef(null);

//   const onLoad = useCallback((map) => {
//     mapRef.current = map;
//   }, []);

//   const onUnmount = useCallback(() => {
//     mapRef.current = null;
//   }, []);

//   const mapClickHandler = useCallback((e) => {
//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();
//     console.log(`Latitude: ${lat}, Longitude: ${lng}`);

//     // Assuming google.maps.Geocoder is available
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         console.log("Address:", results[0].formatted_address);
//       } else {
//         console.error("Geocoder failed due to: " + status);
//       }
//     });
//   }, []);

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//       <GoogleMap
//         mapContainerClassName="w-full h-[100vh]"
//         center={center}
//         zoom={17}
//         onLoad={onLoad}
//         onUnmount={onUnmount}
//         onClick={mapClickHandler}
//       >
//         {/* Additional map content like markers can go here */}
//       </GoogleMap>
//   );
// }

// export default MapComponent;

/*
Functionality 2: 
                  a) Upon searching for results, the map will show all the search result apartments on the map with markers.
                  b) Upon clicking on a marker, a brief description of the apartment will be shown, preferably using cards

Status: Working, but need to implement AdvancedMarker because Marker is deprecated, if we have time
*/

// import React from 'react';
// import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

// const center = {
//   lat: 23.764424,
//   lng: 90.429645
// };

// const apartments = [
//   { lat: 23.764424, lng: 90.429645 },
//   { lat: 23.818840, lng: 90.378494},
//   { lat: 23.819576, lng: 90.434752}
//   // Add more apartments here
// ];

// function MyMapComponent() {
//   return (
//     <LoadScript googleMapsApiKey="AIzaSyC2qBiJzOitO345ed0T-BAVgnM0XRnOH8g">
//       <GoogleMap
//         mapContainerClassName="w-full h-[100vh]"
//         center={center}
//         zoom={13}
//       >
//         {apartments.map((apartment, index) => (
//           <Marker key={index} position={{ lat: apartment.lat, lng: apartment.lng }} />
//         ))}
//       </GoogleMap>
//     </LoadScript>
//   );
// }

// export default React.memo(MyMapComponent);

/*
Functionality 3: 
                  a) Show nearby schools, colleges, cafes, restaurants, parks etc nearby an apartment ie a co-ordinate.
*/

import React, { useEffect, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";

const center = { lat: 23.732583, lng: 90.387045 }; // Example coordinate
const libraries = ["places"];

function NearbyPlacesComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC2qBiJzOitO345ed0T-BAVgnM0XRnOH8g", // Replace with your actual API key
    libraries,
  });

  const searchRadius = 1500;
  // State to hold nearby places and the selected place
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      const request = {
        location: center,
        radius: "1500",
        type: ["university"],
      };

      service.nearbySearch(request, (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results
        ) {
          setPlaces(results);
          console.log(results);
        }
      });
    }
  }, [isLoaded]);

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerClassName="w-full h-[100vh]"
      center={center}
      zoom={15}
    >
      {places.map((place, index) => (
        <Marker
          key={index}
          position={place.geometry.location}
          onClick={() => handleMarkerClick(place)}
        />
      ))}

      {selectedPlace && (
        <InfoWindow
          position={selectedPlace.geometry.location}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div>
            <h3>{selectedPlace.name}</h3>
            <p>{selectedPlace.vicinity}</p>
            {/* You can include more details here */}
          </div>
        </InfoWindow>
      )}
      <Circle
        center={center}
        radius={searchRadius}
        options={{
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.25,
          clickable: false,
        }}
      />
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}

export default NearbyPlacesComponent;


// import React, { useState } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


// // Example center, you can use state to change this based on geocoding result
// const center = {
//   lat: 23.6850,
//   lng: 90.3563
// };

// const API_KEY = "AIzaSyC2qBiJzOitO345ed0T-BAVgnM0XRnOH8g"; // Replace with your actual Google API Key

// function MyMapComponent() {
//   const [location, setLocation] = useState(center);

//   const geocodeLocation = (areaName) => {
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(areaName)}&key=${API_KEY}`;

//     fetch(url)
//       .then(response => response.json())
//       .then(data => {
//         if (data.status === 'OK') {
//           const { lat, lng } = data.results[0].geometry.location;
//           setLocation({ lat, lng });
//           console.log("Geocoding success:", lat, lng);
//         } else {
//           console.error("Geocoding failed:", data.status);
//         }
//       })
//       .catch(error => console.error("Error:", error));
//   };

//   return (
//     <LoadScript
//       googleMapsApiKey={API_KEY}
//     >
//       <GoogleMap
//         mapContainerClassName='w-full h-[100vh]'
//         center={location}
//         zoom={9}
//       >
//         <Marker position={location} />
//         {/* Your map components */}
//       </GoogleMap>
//       <input type="text" placeholder="Enter location" onBlur={(e) => geocodeLocation(e.target.value)} className="border p-2 m-2" />
//       <button onClick={() => geocodeLocation('Banasree, Dhaka')}>Geocode Gulshan</button>
//     </LoadScript>
//   )
// }

// export default React.memo(MyMapComponent);
