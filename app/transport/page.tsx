"use client";

import React, { useEffect, useState } from "react";
import TransportMap from "../components/TransportMapNew";
import TransportList from "../components/TransportList";
import { mockApiResponse, mockBusLines } from "../mock-data";

type BusLine = {
  id: number;
  name: string;
  route_number: string;
  current_location: { latitude: number; longitude: number; address?: string };
  status: string;
  bus_stops?: Array<{ id: number; name: string; latitude: number; longitude: number; estimated_arrival?: string; is_next_stop?: boolean }>;
  vehicle_info?: any;
  driver?: any;
  incidents?: any[];
};

export default function TransportPage() {
  const [lines, setLines] = useState<BusLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);
  const [dataSource, setDataSource] = useState<'api' | 'mock' | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // Try to fetch from API
    fetch("https://amanabootcamp.org/api/fs-classwork-data/amana-transportation")
      .then(async (res) => {
        // Log the raw response text to see what we're getting
        const text = await res.text();
        console.log('Raw API Response:', text);
        
        try {
          // Try to parse it as JSON
          const data = JSON.parse(text);
          return data;
        } catch (e) {
          console.error('JSON Parse Error:', e);
          throw new Error('Invalid JSON response from API');
        }
      })
      .then((data) => {
        console.log('API Response:', data);
        if (!mounted) return;
        if (data && data.bus_lines) {
          setLines(data.bus_lines);
          setDataSource('api');
          console.log('Set lines from API:', data.bus_lines);
        } else {
          console.error('No bus_lines in data:', data);
          setLines(mockBusLines);
          setDataSource('mock');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch transport data", err);
        if (!mounted) return;
        // Use mock data if API fails
        console.log('Using mock data instead');
        setLines(mockBusLines);
        setDataSource('mock');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark Header */}
      <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="font-bold">Amana Logo</div>
          <button className="px-4 py-2">Menu</button>
        </div>
      </header>

      {/* Green Title Section */}
      <div className="bg-green-500 text-white py-8 px-4">
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2">{mockApiResponse.company_info.name}</h1>
            <p className="text-lg opacity-90">{mockApiResponse.company_info.description}</p>
          
            {/* Operational Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white bg-opacity-10 p-4 rounded-lg text-white mt-4">
              <div>
                <p className="text-sm opacity-80">Active Buses</p>
                <p className="text-xl font-semibold">
                  {mockApiResponse.operational_summary.active_buses} / {mockApiResponse.operational_summary.total_buses}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-80">Total Passengers</p>
                <p className="text-xl font-semibold">{mockApiResponse.operational_summary.current_passengers}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Total Capacity</p>
                <p className="text-xl font-semibold">{mockApiResponse.operational_summary.total_capacity}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Avg. Utilization</p>
                <p className="text-xl font-semibold">{mockApiResponse.operational_summary.average_utilization}%</p>
              </div>
            </div>

          {dataSource && (
            <div className="mt-2 text-sm">
              <span className="bg-white/20 px-2 py-1 rounded">
                Data Source: {dataSource === 'api' ? 'Live API' : 'Demo Data'}
              </span>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Bus Filters */}
        <div className="bg-cream-50 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Active Bus Map</h2>
          {loading ? (
            <div className="p-4 text-gray-600">Loading bus data...</div>
          ) : lines.length === 0 ? (
            <div className="p-4 text-red-600">No active buses found. Please try again later.</div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {lines.map((line) => (
              <button
                key={line.id}
                onClick={() => setSelectedBusId(line.id)}
                className={`px-4 py-2 rounded ${
                  selectedBusId === line.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Bus {line.id}
              </button>
            ))}
          </div>
          )}
        </div>

        {/* Map Section */}
        <div className="h-[50vh] rounded-lg overflow-hidden shadow-lg">
          <TransportMap lines={lines} selectedBusId={selectedBusId} />
        </div>

        {/* Bus Schedule Section */}
        <div className="bg-cream-50 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Bus Schedule</h2>
          {loading ? (
            <div className="p-4">Loading…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Bus Stop</th>
                    <th className="py-2 px-4 text-left">Next Time of Arrival</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBusId && lines.find(l => l.id === selectedBusId)?.bus_stops?.map(stop => (
                    <tr key={stop.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{stop.name}</td>
                      <td className="py-2 px-4">
                        {stop.is_next_stop && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 text-sm rounded mr-2">
                            Next Stop
                          </span>
                        )}
                        {stop.estimated_arrival || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
