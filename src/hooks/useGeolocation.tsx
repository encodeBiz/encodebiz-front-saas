import { useState, useEffect } from 'react';
interface IGeoPosition {
    latitude: number
    longitude: number
    accuracy: number
    altitude: number
    altitudeAccuracy: number
    heading: number
    speed: number
    timestamp: number
}
export const useGeolocation = (options = {}) => {
    const [position, setPosition] = useState<IGeoPosition>();
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError(new Error('Geolocation is not supported by your browser'));
            setIsLoading(false);
            return;
        }

        const successHandler = (pos: GeolocationPosition) => {
            setPosition({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                altitude: pos.coords.altitude as number,
                altitudeAccuracy: pos.coords.altitudeAccuracy  as number,
                heading: pos.coords.heading  as number,
                speed: pos.coords.speed  as number,
                timestamp: pos.timestamp
            });
            setIsLoading(false);
        };

        const errorHandler = (err: GeolocationPositionError) => {
            setError(err);
            setIsLoading(false);
        };

        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
            ...options
        };

        const watchId = navigator.geolocation.watchPosition(
            successHandler,
            errorHandler,
            geoOptions
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [options]);

    return { position, error, isLoading };
};