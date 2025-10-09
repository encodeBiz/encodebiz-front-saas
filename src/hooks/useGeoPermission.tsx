/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useCallback, useEffect } from "react";

type GeoStatus = "idle" | "granted" | "prompt" | "denied" | "fetching" | "error";
interface GeoPosition {
    lat: number;
    lng: number;
    accuracy: number;
}

export function useGeoPermission() {
    const [status, setStatus] = useState<GeoStatus>("idle");
    const [position, setPosition] = useState<GeoPosition | null>(null);
    const [error, setError] = useState<string | null>(null);

    const checkPermission = useCallback(async () => {
        if (!navigator.permissions || !navigator.geolocation) {
            setStatus("error");
            setError("Tu navegador no soporta geolocalización.");
            return;
        }

        try {
            const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
            setStatus(permission.state as GeoStatus);
            if(permission.state === 'granted') requestLocation()
            permission.onchange = () => {
                setStatus(permission.state as GeoStatus);
            };
        } catch (err) {
            setError("No se pudo consultar el estado del permiso."+ err);
            setStatus("error");
        }
    }, []);

    const requestLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            setError("Geolocalización no soportada por el navegador.");
            setStatus("error");
            return;
        }

        setStatus("fetching");
        setError(null);

        return new Promise<void>((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setStatus("granted");
                    console.log(pos);
                    
                    setPosition({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
                    });                   
                    resolve();
                },
                (err) => {
                    if (err.code === err.PERMISSION_DENIED) {
                        setStatus("denied");
                        setError("El permiso de ubicación fue denegado.");
                    } else if (err.code === err.TIMEOUT) {
                        setStatus("error");
                        setError("Tiempo de espera agotado al obtener la ubicación.");
                    } else {
                        setStatus("error");
                        setError("Error al obtener la ubicación.");
                    }
                    resolve();
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }, []);

    useEffect(() => {
        checkPermission();
    }, []);
 

    return {
        status,
        position,
        error,
        requestLocation,
        checkPermission,
    };
}