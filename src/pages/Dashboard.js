import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ManageCategories from "../components/ManageCategories";
import Map from "../components/Map";

export default function Dashboard() {
    const { state } = useLocation();
    const { user } = state;
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const fetchCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCurrentLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            }
        };
        fetchCurrentLocation();
    }, []);

    if (user.roleId === 3) {
        return <ManageCategories />;
    } else if (user.roleId === 1 || user.roleId === 2) {
        return <Map user={user} currentLocation={currentLocation} />;
    } else {
        return null;
    }
}
