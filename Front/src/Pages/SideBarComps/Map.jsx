import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF as Marker, InfoWindow } from '@react-google-maps/api';
import lakesData from '../../assets/additional/lakes.json';

const containerStyle = {
  width: '100%',
  height: '100vh',
  margin: '0',
  padding: '0',
};

const center = {
  lat: 54.982916,
  lng: 24.782941,
};

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedLake, setSelectedLake] = useState(null);
  const [visitedLakes, setVisitedLakes] = useState([]);

  useEffect(() => {
    setMarkers(lakesData);
  }, []);

  const toggleVisited = (lakeName) => {
    if (visitedLakes.includes(lakeName)) {
      setVisitedLakes(visitedLakes.filter((name) => name !== lakeName));
    } else {
      setVisitedLakes([...visitedLakes, lakeName]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <div style={{ width: '100%' }}>
        <LoadScript googleMapsApiKey="AIzaSyD3B5GSIZRLo5927KVskPigyVrrJJKZx_c">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
            {markers.map((marker) => (
              <Marker
                key={marker.name}
                position={{ lat: parseFloat(marker.x), lng: parseFloat(marker.y) }}
                onClick={() => setSelectedLake(marker)}
              />
            ))}

            {selectedLake && (
              <InfoWindow
                position={{ lat: parseFloat(selectedLake.x), lng: parseFloat(selectedLake.y) }}
                onCloseClick={() => setSelectedLake(null)}
              >
                <div>
                  <h2>{selectedLake.name}</h2>
                  <p>
                    {selectedLake.is_rented ? 'Rented: Yes' : 'Rented: No'}<br />
                    {selectedLake.is_private ? 'Private: Yes' : 'Private: No'}<br />
                    {selectedLake.lake ? 'Lake: Yes' : 'Lake: No'}<br />
                    {selectedLake.river ? 'River: Yes' : 'River: No'}
                  </p>
                  <label>
                    <input
                      type="checkbox"
                      checked={visitedLakes.includes(selectedLake.name)}
                      onChange={() => toggleVisited(selectedLake.name)}
                    />
                    Been here
                  </label>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default Map;