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

  // Add markers when map is ready
  useEffect(() => {
    const addMarkers = async () => {
      if (!mapReady || !mapRef.current) {
        console.log('Map not ready for markers');
        return;
      }

      try {
        const L = (await import('leaflet')).default;
        console.log('Adding markers for', lines.length, 'buses');

        // Clear existing markers
        Object.values(markersRef.current).forEach((marker: any) => marker.remove());
        markersRef.current = {};

        // Add markers for each bus
        const bounds = L.latLngBounds([]);
        
        lines.forEach(line => {
          const position = [line.current_location.latitude, line.current_location.longitude];
          
          // Create marker with divIcon
          const marker = L.marker(position as [number, number], {
            icon: L.divIcon({
              className: 'bus-marker',
              html: `
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
                  ${line.id}
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            })
          });

          // Add popup
          marker.bindPopup(`
            <div class="bg-white rounded-lg p-4 min-w-[200px]">
              <div class="font-bold text-lg mb-2">Bus ${line.id}</div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span class="font-medium text-green-500">${line.status}</span>
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

          marker.addTo(mapRef.current!);
          markersRef.current[line.id] = marker;
          bounds.extend(position as [number, number]);
        });

        // Fit map to show all markers
        if (!bounds.isEmpty()) {
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {
        console.error('Failed to add markers:', error);
      }
    };

    addMarkers();
  }, [lines, mapReady]);

  // Handle selected bus
  useEffect(() => {
    if (!mapReady || !mapRef.current || selectedBusId === null) return;

    const marker = markersRef.current[selectedBusId];
    if (marker) {
      const line = lines.find(l => l.id === selectedBusId);
      if (line) {
        mapRef.current.setView(
          [line.current_location.latitude, line.current_location.longitude],
          13,
          { animate: true }
        );
        marker.openPopup();
      }
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