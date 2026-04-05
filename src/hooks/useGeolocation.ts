import { useState, useCallback } from 'react';

interface GeoState {
  location: { lat: number; lng: number } | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ location: null, error: null, isLoading: false });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ location: null, error: 'Geolocation is not supported by your browser', isLoading: false });
      return;
    }

    setState(s => ({ ...s, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      pos => {
        setState({
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
          isLoading: false,
        });
      },
      err => {
        setState({
          location: null,
          error: err.code === 1 ? 'Location access denied' : 'Could not determine location',
          isLoading: false,
        });
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  return { ...state, requestLocation };
}
