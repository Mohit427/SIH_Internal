// Mock "source of truth" seed data for the YatraSense demo.
// All lat/lng are real Jaipur coordinates (for a believable map), everything
// else (density, vendors, tourist profile) is entirely fabricated for the demo.

export function freshSeed() {
  return {
    sites: [
      {
        id: "site-amber-fort",
        name: "Amber Fort",
        category: "Heritage Fort",
        lat: 26.9855,
        lng: 75.8513,
        openHours: "8:00 AM - 5:30 PM",
        currentDensity: 46,
        rate: 1.6, // density points gained per simulation tick
      },
      {
        id: "site-hawa-mahal",
        name: "Hawa Mahal",
        category: "Monument",
        lat: 26.9239,
        lng: 75.8267,
        openHours: "9:00 AM - 4:30 PM",
        currentDensity: 58,
        rate: 2.4,
      },
      {
        id: "site-city-palace",
        name: "City Palace",
        category: "Palace Museum",
        lat: 26.9258,
        lng: 75.8237,
        openHours: "9:30 AM - 5:00 PM",
        currentDensity: 34,
        rate: 1.1,
      },
      {
        id: "site-nahargarh-fort",
        name: "Nahargarh Fort",
        category: "Hilltop Fort",
        lat: 26.9373,
        lng: 75.8153,
        openHours: "10:00 AM - 5:30 PM",
        currentDensity: 18,
        rate: 0.7,
      },
      {
        id: "site-jal-mahal",
        name: "Jal Mahal",
        category: "Lake Palace (viewpoint)",
        lat: 26.9536,
        lng: 75.8467,
        openHours: "6:00 AM - 6:00 PM",
        currentDensity: 12,
        rate: 0.5,
      },
    ],

    vendors: [
      {
        id: "vendor-001",
        name: "Rajesh Auto Services",
        service: "Auto Rickshaw Ride",
        route: "Hawa Mahal to City Palace",
        licenseStatus: "verified",
        licenseId: "RJ-AUTO-4471",
        priceRange: { min: 180, max: 220 },
      },
      {
        id: "vendor-002",
        name: "Sunshine Handicrafts",
        service: "Souvenir Shop",
        route: "Near Hawa Mahal",
        licenseStatus: "verified",
        licenseId: "RJ-SHOP-1182",
        priceRange: { min: 150, max: 900 },
      },
      {
        id: "vendor-003",
        name: "Speedy City Cabs",
        service: "Cab Ride",
        route: "Amber Fort to City Palace",
        licenseStatus: "unregistered",
        licenseId: null,
        priceRange: { min: 250, max: 600 },
      },
      {
        id: "vendor-004",
        name: "Heritage Walk Guides",
        service: "Guided Walking Tour",
        route: "City Palace Complex",
        licenseStatus: "verified",
        licenseId: "RJ-GUIDE-0093",
        priceRange: { min: 300, max: 500 },
      },
    ],

    // The fictional tourist whose phone the "Tourist App" view simulates.
    touristProfile: {
      touristId: "YS-2026-00842",
      name: "Aditi Sharma",
      nationality: "Indian",
      bloodGroup: "B+",
      allergies: ["Peanuts"],
      emergencyContact: "+91-98xxxxx210",
      phone: "+91-90xxxxx884",
    },

    itinerary: {
      stopIds: ["site-amber-fort", "site-hawa-mahal", "site-city-palace"],
      activeIndex: 0,
      rerouteLog: [],
    },

    alerts: [],
    sosEvents: [],
    activityLog: [],
  };
}
