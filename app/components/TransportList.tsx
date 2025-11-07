"use client";

import React from "react";

type BusLine = {
  id: number;
  name: string;
  route_number: string;
  status: string;
  current_location: { latitude: number; longitude: number; address?: string };
};

export default function TransportList({
  lines,
  selectedBusId,
  onSelect,
}: {
  lines: BusLine[];
  selectedBusId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="p-2">
      <div className="sticky top-0 bg-white p-2 border-b">
        <h2 className="font-semibold">Routes</h2>
        <p className="text-sm text-gray-500">Click a route to center the map</p>
      </div>

      <ul>
        {lines.map((line) => (
          <li
            key={line.id}
            className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedBusId === line.id ? "bg-indigo-50" : "bg-white"}`}
            onClick={() => onSelect(line.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{line.name}</div>
                <div className="text-sm text-gray-600">{line.route_number} • {line.current_location.address}</div>
              </div>
              <div className="text-sm text-gray-500">{line.status}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
