"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map } from 'leaflet';

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

interface TransportMapProps {
  lines: BusLine[];
  selectedBusId: number | null;
}

export default function TransportMap({ lines, selectedBusId }: TransportMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, any>>({});

  // Initialize map
  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;
      console.log('Starting map initialization...');

      try {
        const L = (await import('leaflet')).default;
        
        if (!mounted) return;
        
        // Create map instance
        const map = L.map(mapContainerRef.current, {
          center: [3.139, 101.6869],
          zoom: 11,
          zoomControl: true,
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapRef.current = map;
        setMapReady(true);
        console.log('Map initialized successfully');
      } catch (error) {
        console.error('Map initialization failed:', error);
      }
    };

    initMap();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Add markers / route for selected bus only
  useEffect(() => {
    const renderSelectedBus = async () => {
      if (!mapReady || !mapRef.current) {
        console.log('Map not ready for markers');
        return;
      }

      try {
        const L = (await import('leaflet')).default;
        console.log('Rendering selected bus:', selectedBusId);

        // Clear existing markers / polylines
        // markersRef will hold keys: 'bus', 'stops' (array), 'polyline'
        try {
          if (markersRef.current.polyline) {
            markersRef.current.polyline.remove();
          }
          if (markersRef.current.stops) {
            markersRef.current.stops.forEach((m: any) => m.remove());
          }
          if (markersRef.current.bus) {
            markersRef.current.bus.remove();
          }
        } catch (e) {
          // ignore
        }
        markersRef.current = {};

        if (selectedBusId === null) {
          // nothing to render
          return;
        }

        const line = lines.find(l => l.id === selectedBusId);
        if (!line) return;

        const busPos: [number, number] = [line.current_location.latitude, line.current_location.longitude];

        // Bus marker
        const busMarker = L.marker(busPos, {
          icon: L.divIcon({
            className: 'bus-marker-selected',
            html: `
              <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
                ${line.id}
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          })
        }).addTo(mapRef.current);

        busMarker.bindPopup(`
          <div class="bg-white rounded-lg p-4 min-w-[200px]">
            <div class="font-bold text-lg mb-2">Bus ${line.id}</div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium ${line.status === 'Active' ? 'text-green-500' : 'text-gray-500'}">${line.status}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Capacity:</span>
                <span class="font-medium">${line.passengers?.utilization_percentage || 0}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Next Stop:</span>
                <span class="font-medium">${line.bus_stops?.find(stop => stop.is_next_stop)?.name || 'N/A'}</span>
              </div>
            </div>
          </div>
        `);

        markersRef.current.bus = busMarker;

        // Build route: start with current location then stops
        const routeCoords: [number, number][] = [];
        routeCoords.push(busPos);
        if (line.bus_stops && line.bus_stops.length > 0) {
          line.bus_stops.forEach(s => routeCoords.push([s.latitude, s.longitude]));
        }

        // Draw polyline
        const poly = L.polyline(routeCoords as any[], {
          color: '#ff7a7a',
          weight: 3,
          opacity: 0.8
        }).addTo(mapRef.current);
        markersRef.current.polyline = poly;

        // Add stop markers
        markersRef.current.stops = [];
        if (line.bus_stops) {
          line.bus_stops.forEach(stop => {
            const stopMarker = L.circleMarker([stop.latitude, stop.longitude], {
              radius: stop.is_next_stop ? 8 : 6,
              color: stop.is_next_stop ? '#ff9900' : '#666',
              fillColor: stop.is_next_stop ? '#ffdd99' : '#fff',
              fillOpacity: stop.is_next_stop ? 0.9 : 0.6
            }).bindPopup(`
              <div class="p-2">
                <div class="font-bold">${stop.name}</div>
                <div class="text-sm">Next Bus Arrival: ${stop.estimated_arrival || 'N/A'}</div>
              </div>
            `).addTo(mapRef.current!);
            markersRef.current.stops.push(stopMarker);
          });
        }

        // Fit to route bounds
        const bounds = L.latLngBounds(routeCoords as any[]);
        if (bounds && bounds.isValid && bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [60, 60] });
        } else {
          mapRef.current.setView(busPos, 13);
        }

      } catch (error) {
        console.error('Failed to render selected bus:', error);
      }
    };

    renderSelectedBus();
  }, [selectedBusId, lines, mapReady]);

  // Handle selected bus
  useEffect(() => {
    if (!mapReady || !mapRef.current || selectedBusId === null) return;

    const busMarker = markersRef.current.bus;
    const line = lines.find(l => l.id === selectedBusId);
    if (busMarker && line) {
      mapRef.current.setView(
        [line.current_location.latitude, line.current_location.longitude],
        13,
        { animate: true }
      );
      busMarker.openPopup();
    }
  }, [selectedBusId, lines, mapReady]);

  // Add styles for markers
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        .bus-marker {
          display: flex !important;
          align-items: center;
          justify-content: center;
          z-index: 1000 !important;
        }
        .bus-marker-selected {
          display: flex !important;
          align-items: center;
          justify-content: center;
          z-index: 1100 !important;
          transform: translateY(-2px);
        }
        .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
          line-height: 1.4;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Debug Overlay */}
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
  );
}