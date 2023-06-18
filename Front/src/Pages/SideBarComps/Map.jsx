import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { toast } from 'react-toastify';
import '../css/Map.css';


const containerStyle = {
  width: '100%',
  height: '70vh',
};


const center = {
  lat: 54.982916,
  lng: 24.782941,
};



const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedLake, setSelectedLake] = useState(null);
  const [visitedLakes, setVisitedLakes] = useState([]);
  const [lakeInfo, setLakeInfo] = useState(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null);

  useEffect(() => {

    fetch('http://193.219.91.103:5915/lakedata')
      .then(res => res.json())
      .then(data => setMarkers(data));

    const fetchGoogleMapsApiKey = async () => {
      try {
        const response = await fetch(`http://193.219.91.103:5915/api/maps`, {
          headers: { token: localStorage.token } 
        });
        const data = await response.json();
        setGoogleMapsApiKey(data.apiKey);
      } catch (error) {
        console.error("Error fetching Google Maps API key:", error);
      }
    };

    fetchGoogleMapsApiKey();
    fetchVisitedLakes();

  }, []);

  const fetchVisitedLakes = async () => {
    try {
      const response = await fetch(`http://193.219.91.103:5915/visited-lakes`, {
        method: "GET",
        headers: { token: localStorage.token }     
      });
      const data = await response.json();
      setVisitedLakes(data);
    } catch (error) {
      console.error("Error fetching visited lakes:", error);
    }
  };

  const toggleVisited = async (lakeName) => {
    let updatedVisitedLakes;
    if (visitedLakes.includes(lakeName)) {
      updatedVisitedLakes = visitedLakes.filter((name) => name !== lakeName);
    } else {
      updatedVisitedLakes = [...visitedLakes, lakeName];
    }
    setVisitedLakes(updatedVisitedLakes);

    // Save the updated visited lakes to the database
    const lakeIds = updatedVisitedLakes.map(
      (lakeName) => markers.find((marker) => marker.name === lakeName).id
    );

    const response = await fetch('http://193.219.91.103:5915/save-lakes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.token,
      },
      body: JSON.stringify({ lakeIds }),
    });

    if (!response.ok) {
      alert('Error saving checked lakes');
    } else {
      toast.success('Checked lakes saved successfully');
    }
  };

  const displayLakeInfo = (lake) => {
    setLakeInfo({
      name: lake.name,
      isRented: lake.isRented,
      isPrivate: lake.isPrivate,
    });
  };

  const getIconUrl = (lakeName) => {
    const isVisited = visitedLakes.includes(lakeName);
    return isVisited
      ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  };


  return (
    <div className='mapwrapper'>
      <div className='mapsidebar'>
        {lakeInfo && (
          <>
            <h2>{lakeInfo.name}</h2>
            <p>
              {lakeInfo.isRented ? 'Rented: Yes' : 'Rented: No'}<br />
              {lakeInfo.isPrivate ? 'Private: Yes' : 'Private: No'}
            </p>
            <div className='mapcheckwrapper'>

              <input
                type="checkbox"
                checked={visitedLakes.includes(lakeInfo.name)}
                onChange={() => toggleVisited(lakeInfo.name)}
              />
              <p>Been here</p>

            </div>
          </>
        )}
      </div>
      <div style={{ width: '100%' }}>
        {googleMapsApiKey && ( 
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap mapContainerStyle={containerStyle} className='mapcontainer' center={center} zoom={8}>
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={{ lat: parseFloat(marker.x), lng: parseFloat(marker.y) }}
                onClick={() => {
                  setSelectedLake(marker);
                  displayLakeInfo(marker);
                }}
                icon={getIconUrl(marker.name)} 
              />
            ))}

            {selectedLake && (
              <InfoWindow
                position={{ lat: parseFloat(selectedLake.x), lng: parseFloat(selectedLake.y) }}
                onCloseClick={() => setSelectedLake(null)}
              >
                <div>
                  <h2>{selectedLake.name}</h2>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
        )}
      </div>
    </div>
  );
};

export default Map;