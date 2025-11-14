# Bus Tracking Application Documentation

## Overview
This Next.js application provides an interactive bus tracking system with route visualization and stop scheduling functionality. The application uses Leaflet for map integration and displays bus routes, stops, and schedules in a user-friendly interface.

## Technical Stack
- **Framework**: Next.js with TypeScript
- **Map Integration**: Leaflet.js
- **Styling**: Tailwind CSS
- **Data Management**: Mock data system (for development)

## Key Components

### 1. TransportMap Component
Located in: `app/components/TransportMap.tsx`

Main features:
- Interactive map initialization
- Bus route visualization
- Stop markers with popups
- Route selection functionality
- Dynamic route path drawing

Key implementations:
- Uses Leaflet for map rendering
- Handles multiple bus stops per route
- Displays route information in popups
- Manages map state and user interactions

### 2. Mock Data Structure
Located in: `app/mock-data.ts`

Contains:
- Bus route definitions
- Stop information
- Schedule data
- Coordinates for routes and stops

Data structure:
```typescript
interface BusStop {
  id: number;
  name: string;
  coordinates: [number, number];
  arrival_time: string;
}

interface BusRoute {
  id: number;
  name: string;
  bus_stops: BusStop[];
}
```

### 3. Transport Page
Located in: `app/transport/page.tsx`

Features:
- Main layout for the transport view
- Integration of map component
- Route selection interface
- Schedule display

## Key Features

### 1. Route Visualization
- Dynamic polyline drawing for selected routes
- Color-coded route paths
- Interactive route selection

### 2. Stop Management
- Clickable stop markers
- Information popups for each stop
- Arrival time display
- Multiple stops per route support

### 3. User Interface
- Clean, responsive design
- Interactive map controls
- Route selection interface
- Schedule display integration

## Implementation Details

### Map Initialization
```typescript
// Map is initialized with default view of the service area
const map = L.map('map').setView([defaultLat, defaultLng], defaultZoom);

// Tile layer implementation
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
```

### Route Rendering
- Routes are rendered using Leaflet Polylines
- Each route has unique styling
- Stop markers are added at specified coordinates
- Popups display stop information and schedules

### State Management
- Active route selection
- Map instance management
- Marker and polyline cleanup
- Event listener handling

## Development Notes

### Recent Improvements
1. Fixed map initialization issues
2. Added multi-stop support
3. Implemented route visualization
4. Cleaned up duplicate code
5. Enhanced TypeScript type safety

### Best Practices Implemented
- Proper Leaflet cleanup in useEffect
- TypeScript strict mode compliance
- Component isolation
- Responsive design patterns
- Clean code structure

## Future Enhancements
1. Real-time bus tracking integration
2. Enhanced schedule management
3. User location integration
4. Route optimization features
5. Mobile-specific optimizations

## Deployment
The application is configured for deployment on Vercel, with proper Next.js optimization settings.

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Access the application at `http://localhost:3000`

## Dependencies
- next
- react
- react-dom
- leaflet
- tailwindcss
- typescript

## Contributing
Follow the standard Git workflow:
1. Create a feature branch
2. Make changes
3. Submit pull request
4. Code review
5. Merge to main

## License
MIT License