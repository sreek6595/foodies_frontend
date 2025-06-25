import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { getDriverLocAPI } from "../services/deliveryServices";

const DriverLocation = () => {
  const [error, setError] = useState(null); // Store geolocation errors
const mutation=useMutation({
  mutationFn:getDriverLocAPI,
  mutationKey:['location']
})
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log(latitude, longitude);
          
          try {
            await mutation.mutate({latitude:latitude, longitude:longitude})
            console.log("Location sent:", { latitude, longitude });
            setError(null); // Clear any previous errors
          } catch (error) {
            console.error("Error sending location:", error);
            setError("Failed to send location to server.");
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          switch (err.code) {
            case 1: // Permission denied
              setError("Location access denied. Please enable location services.");
              break;
            case 2: // Position unavailable
              setError("Location unavailable. Please check your GPS or network.");
              break;
            case 3: // Timeout
              setError("Location request timed out. Retrying...");
              // Retry after a delay
              setTimeout(() => {
                navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    try {
                      await mutation.mutate({latitude:latitude, longitude:longitude})
                      console.log("Retry location sent:", { latitude, longitude });
                      setError(null);
                    } catch (error) {
                      console.error("Error sending retry location:", error);
                      setError("Failed to send retry location to server.");
                    }
                  },
                  (retryErr) => console.error("Retry failed:", retryErr),
                  { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
              }, 2000);
              break;
            default:
              setError("An unknown error occurred while fetching location.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Increased timeout to 10 seconds
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div>
      <h2>Driver Location Sharing</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>Sending live location...</p>
      )}
    </div>
  );
};

export default DriverLocation;