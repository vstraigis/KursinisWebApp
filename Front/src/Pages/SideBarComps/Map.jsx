import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const sidebarStyle = {
  width: '34%',
  height: '100vh',
  backgroundColor: '#f0f0f0',
  padding: '10px',
  overflowY: 'auto',
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
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/lakedata')
      .then(res => res.json())
      .then(data => setMarkers(data));

    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:5000/dashboard/", {
          method: "GET",
          headers: { token: localStorage.token } // Replace with the actual token      
        });
        const { user } = await response.json();
        console.log("User :", user);
        setUserId(user.id);

        // Fetch visited lakes for the user
        fetchVisitedLakes(user.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const fetchVisitedLakes = async (fetchedUserId) => {
    try {
      const response = await fetch(`http://localhost:5000/visited-lakes/${fetchedUserId}`);
      const data = await response.json();
      setVisitedLakes(data);
    } catch (error) {
      console.error("Error fetching visited lakes:", error);
    }
  };

  const toggleVisited = (lakeName) => {
    if (visitedLakes.includes(lakeName)) {
      setVisitedLakes(visitedLakes.filter((name) => name !== lakeName));
    } else {
      setVisitedLakes([...visitedLakes, lakeName]);
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

  const saveCheckedLakes = async () => {
    const lakeIds = visitedLakes.map((lakeName) => markers.find((marker) => marker.name === lakeName).id);

    const response = await fetch('http://localhost:5000/save-lakes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, lakeIds }),
    });

    if (response.ok) {
      alert('Checked lakes saved successfully');
    } else {
      alert('Error saving checked lakes');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div style={sidebarStyle}>
        {lakeInfo && (
          <>
            <h2>{lakeInfo.name}</h2>
            <p>
              {lakeInfo.isRented ? 'Rented: Yes' : 'Rented: No'}<br />
              {lakeInfo.isPrivate ? 'Private: Yes' : 'Private: No'}
            </p>
            <label>
              <input
                type="checkbox"
                checked={visitedLakes.includes(lakeInfo.name)}
                onChange={() => toggleVisited(lakeInfo.name)}
              />
              Been here
            </label>
            <button onClick={saveCheckedLakes}>Save checked lakes</button>
          </>
        )}
      </div>
      <div style={{ width: '100%' }}>
        <LoadScript googleMapsApiKey="AIzaSyD3B5GSIZRLo5927KVskPigyVrrJJKZx_c">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={{ lat: parseFloat(marker.x), lng: parseFloat(marker.y) }}
                onClick={() => {
                  setSelectedLake(marker);
                  displayLakeInfo(marker);
                }}
                icon={getIconUrl(marker.name)} // Add this line
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
      </div>
    </div>
  );
};

export default Map;