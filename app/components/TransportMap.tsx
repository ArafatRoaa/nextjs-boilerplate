"use client";

import React, { useEffect, useRef, useState } from "react";
// Moved Leaflet CSS to root layout

// Add custom styles for markers and popups
const customStyles = `
.custom-bus-marker {
  display: flex !important;
  align-items: center;
  justify-content: center;
  z-index: 1000 !important;
}
.bus-popup .leaflet-popup-content-wrapper {
  border-radius: 8px;
  padding: 0;
}
.bus-popup .leaflet-popup-content {
  margin: 0;
}
.bus-popup .leaflet-popup-tip-container {
  margin-top: -1px;
}
`;

if (typeof document !== 'undefined') {
  // Add styles to head when in browser
  const style = document.createElement('style');
  style.textContent = customStyles;
  document.head.appendChild(style);
}


// Define types for bus data
type BusLine = {
  id: number;
  name: string;
  route_number: string;
  current_location: { latitude: number; longitude: number; address?: string };
  status: string;
  passengers?: {
    current: number;
    capacity: number;
    utilization_percentage: number;
  };
  bus_stops?: Array<{ 
    id: number; 
    name: string; 
    latitude: number; 
    longitude: number; 
    estimated_arrival?: string; 
    is_next_stop?: boolean 
  }>;
};

export default function TransportMap({
  lines,
  selectedBusId,
}: {
  lines: BusLine[];
  selectedBusId: number | null;
}) {
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      console.log('Map init starting...');
      if (!mapContainerRef.current || mapRef.current) {
        console.log('Map already exists or container not ready');
        return;
      }

      try {
        // Import Leaflet
        const L = (await import('leaflet')).default;
        console.log('Leaflet imported successfully');

        // Create map instance
        const map = L.map(mapContainerRef.current).setView([3.139, 101.6869], 11);
        console.log('Map instance created');

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        console.log('Tile layer added');

        // Set up icon defaults
        const DefaultIcon = L.Icon.Default;
        DefaultIcon.mergeOptions({
          iconUrl: '/leaflet/marker-icon.png',
          iconRetinaUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        console.log('Icon defaults configured');

        // Store references and mark as ready
        mapRef.current = map;
        leafletRef.current = L;
        setMapReady(true);
        console.log('Map initialization complete');
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initMap();

        // Set default icon URLs and sizes to use the images in public/leaflet
        try {
          const DefaultIcon = (Leaflet as any).Icon?.Default;
          if (DefaultIcon && DefaultIcon.mergeOptions) {
            DefaultIcon.mergeOptions({
              iconRetinaUrl: '/leaflet/marker-icon.png',
              iconUrl: '/leaflet/marker-icon.png',
              shadowUrl: '/leaflet/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
          }
        } catch (e) {
          console.warn('Could not set Leaflet default icon options', e);
        }

        const defaultCenter: any = [3.139, 101.6869]; // KL central as default
        const map = Leaflet.map(mapContainerRef.current).setView(defaultCenter, 11);

        Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        if (!mounted) return;
        mapRef.current = map;
        setMapReady(true);
        console.log('TransportMap: Leaflet loaded and map initialized');
      } catch (e) {
        console.error('Failed to load leaflet on client:', e);
      }
    })();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Update markers and routes when lines change
  useEffect(() => {
  const Leaflet = leafletRef.current;
  const map = mapRef.current;
  if (!map || !Leaflet || !mapReady) return;

  // Clear existing markers and routes
  Object.values(markersRef.current).forEach((marker: any) => marker.remove());
  markersRef.current = {};

    // Add new markers and routes for each line
    console.log('TransportMap: adding markers for', lines.length, 'lines');
    lines.forEach(line => {
      console.log('Adding line', line.id, line.name, line.current_location);
      // Create bus marker
      // Create a custom icon for better visibility
      const busIcon = Leaflet.divIcon({
        className: 'custom-bus-marker',
        html: `<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
          ${line.id}
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -20]
      });

      const marker = Leaflet.marker([line.current_location.latitude, line.current_location.longitude], {
        icon: busIcon
      }).bindPopup(`
        <div class="bg-white rounded-lg shadow-lg p-4" style="min-width: 200px;">
          <div class="text-lg font-bold mb-3">Bus ${line.id}</div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Status:</span>
              <span class="font-medium ${line.status === 'Active' ? 'text-green-500' : 'text-gray-500'}">${line.status}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Capacity:</span>
              <span class="font-medium">${line.passengers?.utilization_percentage || 0}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Next Stop:</span>
              <span class="font-medium">${line.bus_stops?.find(stop => stop.is_next_stop)?.name || 'N/A'}</span>
            </div>
          </div>
        </div>
      `, {
        className: 'bus-popup'
      });
      
  marker.addTo(map);
  console.log('Marker added for line', line.id);

      // Also add a visible circle marker fallback in case icon images fail to render
      try {
        const circle = Leaflet.circleMarker([line.current_location.latitude, line.current_location.longitude], {
          radius: 8,
          color: '#1f8ef1',
          fillColor: '#1f8ef1',
          fillOpacity: 0.9
        }).bindTooltip(`${line.name} (${line.route_number})`);
  circle.addTo(map);
  markersRef.current[`circle-${line.id}`] = circle;
  console.log('Circle marker added for line', line.id);
      } catch (e) {
        console.warn('Failed to add circle fallback for line', line.id, e);
      }
      markersRef.current[line.id] = marker;

      // Draw route line if bus stops exist
      if (line.bus_stops && line.bus_stops.length > 0) {
        const routeCoordinates = line.bus_stops.map(stop => [stop.latitude, stop.longitude]);
        
        // Create route line with animation
  const routeLine = Leaflet.polyline(routeCoordinates as any[], {
          color: '#22c55e', // Green color matching the header
          weight: 3,
          opacity: 0.6,
          dashArray: '10, 10',
          dashOffset: '0'
        }).addTo(map);

        // Add stop markers
        line.bus_stops.forEach(stop => {
          const isNextStop = stop.is_next_stop;
          const stopMarker = Leaflet.circle([stop.latitude, stop.longitude], {
            color: isNextStop ? '#22c55e' : '#666',
            fillColor: isNextStop ? '#22c55e' : '#fff',
            fillOpacity: isNextStop ? 0.6 : 0.4,
            radius: isNextStop ? 100 : 50
          }).bindPopup(`
            <div class="p-2">
              <div class="font-bold">${stop.name}</div>
              <div class="text-sm mt-1">Arrival: ${stop.estimated_arrival || 'N/A'}</div>
            </div>
          `);
          stopMarker.addTo(map);
        });
      }
    });

    // Fit map view to show all bus locations if any
    try {
      const latlngs = lines.map(l => [l.current_location.latitude, l.current_location.longitude]);
      if (latlngs.length > 0) {
  map.fitBounds(latlngs as any, { padding: [60, 60] });
  console.log('Map fitBounds to', latlngs.length, 'points');
      }
    } catch (e) {
      console.warn('Failed to fit map bounds', e);
    }
  }, [lines, mapReady]);

  // Handle selected bus changes
  useEffect(() => {
  const Leaflet = leafletRef.current;
  const map = mapRef.current;
  if (!Leaflet || !map || selectedBusId === null) return;

    const selected = lines.find(l => l.id === selectedBusId);
    if (!selected) return;

    map.setView(
      [selected.current_location.latitude, selected.current_location.longitude],
      12,
      { animate: true }
    );

    const marker = markersRef.current[selectedBusId];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedBusId, lines]);

  // Add debug overlay
  return (
    <>
      <div ref={mapContainerRef} className="h-full w-full relative">
        <div className="absolute top-0 left-0 z-50 bg-white/90 p-4 rounded-br-lg shadow-lg m-2 text-sm">
          <div>Map Ready: {mapReady ? '✅' : '❌'}</div>
          <div>Lines Count: {lines.length}</div>
          <div>Selected Bus: {selectedBusId || 'none'}</div>
          {lines.map(line => (
            <div key={line.id} className="text-xs mt-1">
              Bus {line.id}: ({line.current_location.latitude}, {line.current_location.longitude})
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
