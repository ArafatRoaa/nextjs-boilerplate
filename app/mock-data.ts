// This mock data follows the expected API response structure
export const mockApiResponse = {
  message: "Amana Transportation bus data retrieved successfully",
  company_info: {
    name: "Amana Transportation",
    founded: "2019",
    headquarters: "Kuala Lumpur, Malaysia",
    industry: "Public Transportation",
    description: "Modern public bus service connecting key areas in Kuala Lumpur and surrounding regions."
  },
  bus_lines: [
    {
      id: 1,
      name: "KLCC - Petaling Jaya Express",
      route_number: "B101",
      current_location: {
        latitude: 3.158,
        longitude: 101.711,
        address: "Jalan Ampang, near KLCC Twin Towers"
      },
      status: "Active",
      passengers: { current: 32, capacity: 45, utilization_percentage: 71 },
      bus_stops: [
        { id: 1, name: "KLCC Station", latitude: 3.1578, longitude: 101.7114, estimated_arrival: "14:20", is_next_stop: true },
        { id: 2, name: "Pavilion KL", latitude: 3.1490, longitude: 101.7101, estimated_arrival: "14:28", is_next_stop: false },
        { id: 3, name: "Bukit Bintang", latitude: 3.1456, longitude: 101.7130, estimated_arrival: "14:35", is_next_stop: false },
        { id: 4, name: "Jalan Ampang", latitude: 3.1570, longitude: 101.7120, estimated_arrival: "14:42", is_next_stop: false }
      ]
    },
    {
      id: 2,
      name: "Old Town - Mont Kiara Connector",
      route_number: "B205",
      current_location: { latitude: 3.139, longitude: 101.6869, address: "KL Sentral Hub" },
      status: "Active",
      passengers: { current: 28, capacity: 40, utilization_percentage: 70 },
      bus_stops: [
        { id: 1, name: "KL Sentral", latitude: 3.1338, longitude: 101.6869, estimated_arrival: "14:15", is_next_stop: true },
        { id: 2, name: "Bangsar", latitude: 3.1350, longitude: 101.6820, estimated_arrival: "14:25", is_next_stop: false },
        { id: 3, name: "Mid Valley", latitude: 3.1170, longitude: 101.6860, estimated_arrival: "14:35", is_next_stop: false },
        { id: 4, name: "Mont Kiara", latitude: 3.1727, longitude: 101.6509, estimated_arrival: "14:45", is_next_stop: false }
      ]
    },
    {
      id: 3,
      name: "Bangsar - KL Sentral Local",
      route_number: "B310",
      current_location: { latitude: 3.1395, longitude: 101.6800, address: "Bangsar Shopping Centre" },
      status: "Active",
      passengers: { current: 15, capacity: 40, utilization_percentage: 37.5 },
      bus_stops: [
        { id: 1, name: "Bangsar South", latitude: 3.1350, longitude: 101.6820, estimated_arrival: "14:10", is_next_stop: false },
        { id: 2, name: "Bangsar Village", latitude: 3.1360, longitude: 101.6775, estimated_arrival: "14:18", is_next_stop: false },
        { id: 3, name: "Mid Valley", latitude: 3.1170, longitude: 101.6860, estimated_arrival: "14:24", is_next_stop: false },
        { id: 4, name: "KL Sentral", latitude: 3.1338, longitude: 101.6869, estimated_arrival: "14:30", is_next_stop: true }
      ]
    },
    {
      id: 4,
      name: "Cheras - Ampang Circular",
      route_number: "B412",
      current_location: { latitude: 3.150, longitude: 101.720, address: "Cheras Parade" },
      status: "Active",
      passengers: { current: 10, capacity: 35, utilization_percentage: 28.6 },
      bus_stops: [
        { id: 1, name: "Cheras Station", latitude: 3.1480, longitude: 101.7180, estimated_arrival: "14:12", is_next_stop: true },
        { id: 2, name: "Taman Midah", latitude: 3.1370, longitude: 101.7160, estimated_arrival: "14:20", is_next_stop: false },
        { id: 3, name: "Pandan Jaya", latitude: 3.1390, longitude: 101.7320, estimated_arrival: "14:28", is_next_stop: false },
        { id: 4, name: "Ampang", latitude: 3.1600, longitude: 101.7300, estimated_arrival: "14:35", is_next_stop: false }
      ]
    },
    {
      id: 5,
      name: "Subang Jaya Connector",
      route_number: "B520",
      current_location: { latitude: 3.035, longitude: 101.580, address: "Subang Jaya Terminal" },
      status: "Active",
      passengers: { current: 22, capacity: 40, utilization_percentage: 55 },
      bus_stops: [
        { id: 1, name: "USJ 21", latitude: 3.0390, longitude: 101.5800, estimated_arrival: "14:05", is_next_stop: true },
        { id: 2, name: "Subang Parade", latitude: 3.0300, longitude: 101.5850, estimated_arrival: "14:12", is_next_stop: false },
        { id: 3, name: "SS15", latitude: 3.0635, longitude: 101.5890, estimated_arrival: "14:20", is_next_stop: false },
        { id: 4, name: "Setia Jaya", latitude: 3.0250, longitude: 101.5800, estimated_arrival: "14:25", is_next_stop: false }
      ]
    },
    {
      id: 6,
      name: "Gombak - KL Route",
      route_number: "B601",
      current_location: { latitude: 3.237, longitude: 101.706, address: "Gombak Toll" },
      status: "Active",
      passengers: { current: 8, capacity: 30, utilization_percentage: 26.7 },
      bus_stops: [
        { id: 1, name: "Gombak Terminal", latitude: 3.2370, longitude: 101.7060, estimated_arrival: "14:40", is_next_stop: true },
        { id: 2, name: "Wangsa Maju", latitude: 3.2100, longitude: 101.7180, estimated_arrival: "15:00", is_next_stop: false },
        { id: 3, name: "Setiawangsa", latitude: 3.1740, longitude: 101.7190, estimated_arrival: "15:12", is_next_stop: false },
        { id: 4, name: "Titiwangsa", latitude: 3.1680, longitude: 101.7060, estimated_arrival: "15:25", is_next_stop: false }
      ]
    }
  ],
  operational_summary: { total_buses: 6, active_buses: 6, maintenance_buses: 0, total_capacity: 230, current_passengers: 115, average_utilization: 50 }
};

export const mockBusLines = mockApiResponse.bus_lines;