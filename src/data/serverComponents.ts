import { RackComponent } from "@/types/rack";

export const serverComponents: RackComponent[] = [
  {
    id: "dell-r750-1u",
    name: "Dell PowerEdge R750",
    category: "server",
    height: 1,
    width: 100,
    depth: 2, // full depth
    imageUrl: "/images/servers/dell-r750.jpg",
    specifications: {
      manufacturer: "Dell",
      model: "PowerEdge R750",
      power: "495W",
      ports: 4,
      capacity: "32 cores, 1TB RAM",
      weight: "15.5kg",
    },
  },
  {
    id: "hp-dl380-2u",
    name: "HP ProLiant DL380 Gen10",
    category: "server",
    height: 2,
    width: 100,
    depth: 2,
    imageUrl: "/images/servers/hp-dl380.jpg",
    specifications: {
      manufacturer: "HP",
      model: "DL380 Gen10",
      power: "800W",
      ports: 8,
      capacity: "48 cores, 3TB RAM",
      weight: "22.1kg",
    },
  },
  {
    id: "supermicro-1u",
    name: "Supermicro SuperServer 1U",
    category: "server",
    height: 1,
    width: 100,
    depth: 1, // short depth
    imageUrl: "/images/servers/supermicro-1u.jpg",
    specifications: {
      manufacturer: "Supermicro",
      model: "SuperServer 1029P",
      power: "400W",
      ports: 2,
      capacity: "16 cores, 512GB RAM",
      weight: "12.5kg",
    },
  },
  {
    id: "cisco-ucs-c220",
    name: "Cisco UCS C220 M6",
    category: "server",
    height: 1,
    width: 100,
    depth: 2,
    imageUrl: "/images/servers/cisco-ucs-c220.jpg",
    specifications: {
      manufacturer: "Cisco",
      model: "UCS C220 M6",
      power: "650W",
      ports: 4,
      capacity: "32 cores, 2TB RAM",
      weight: "18.2kg",
    },
  },
];

export const storageComponents: RackComponent[] = [
  {
    id: "netapp-fas2750",
    name: "NetApp FAS2750",
    category: "storage",
    height: 2,
    width: 100,
    depth: 2,
    imageUrl: "/images/storage/netapp-fas2750.jpg",
    specifications: {
      manufacturer: "NetApp",
      model: "FAS2750",
      power: "550W",
      capacity: "144TB",
      ports: 16,
      weight: "24.5kg",
    },
  },
  {
    id: "dell-powervault-me5012",
    name: "Dell PowerVault ME5012",
    category: "storage",
    height: 3,
    width: 100,
    depth: 2,
    imageUrl: "/images/storage/dell-me5012.jpg",
    specifications: {
      manufacturer: "Dell",
      model: "PowerVault ME5012",
      power: "600W",
      capacity: "240TB",
      ports: 12,
      weight: "35.8kg",
    },
  },
];

export const networkComponents: RackComponent[] = [
  {
    id: "cisco-nexus-9300",
    name: "Cisco Nexus 9300",
    category: "network",
    height: 1,
    width: 100,
    depth: 1,
    imageUrl: "/images/network/cisco-nexus-9300.jpg",
    specifications: {
      manufacturer: "Cisco",
      model: "Nexus 9300",
      power: "250W",
      ports: 48,
      capacity: "1.44 Tbps",
      weight: "8.5kg",
    },
  },
  {
    id: "juniper-ex4300",
    name: "Juniper EX4300",
    category: "network",
    height: 1,
    width: 100,
    depth: 1,
    imageUrl: "/images/network/juniper-ex4300.jpg",
    specifications: {
      manufacturer: "Juniper",
      model: "EX4300",
      power: "200W",
      ports: 24,
      capacity: "480 Gbps",
      weight: "7.2kg",
    },
  },
  {
    id: "arista-7050sx3",
    name: "Arista 7050SX3",
    category: "network",
    height: 1,
    width: 100,
    depth: 1,
    imageUrl: "/images/network/arista-7050sx3.jpg",
    specifications: {
      manufacturer: "Arista",
      model: "7050SX3",
      power: "180W",
      ports: 32,
      capacity: "1.28 Tbps",
      weight: "6.8kg",
    },
  },
];

export const powerComponents: RackComponent[] = [
  {
    id: "apc-smart-ups-3000",
    name: "APC Smart-UPS 3000VA",
    category: "power",
    height: 2,
    width: 100,
    depth: 2,
    imageUrl: "/images/power/apc-smart-ups-3000.jpg",
    specifications: {
      manufacturer: "APC",
      model: "Smart-UPS SRT3000RMXLI",
      power: "3000VA/2700W",
      capacity: "20 min runtime",
      ports: 8,
      weight: "42.6kg",
    },
  },
  {
    id: "eaton-9px-1500",
    name: "Eaton 9PX 1500VA",
    category: "power",
    height: 1,
    width: 100,
    depth: 2,
    imageUrl: "/images/power/eaton-9px-1500.jpg",
    specifications: {
      manufacturer: "Eaton",
      model: "9PX1500RT",
      power: "1500VA/1350W",
      capacity: "15 min runtime",
      ports: 6,
      weight: "18.5kg",
    },
  },
];

export const accessoryComponents: RackComponent[] = [
  {
    id: "blank-panel-1u",
    name: "1U Blank Panel",
    category: "blank",
    height: 1,
    width: 100,
    depth: 0,
    imageUrl: "/images/accessories/blank-panel-1u.jpg",
    specifications: {
      manufacturer: "Generic",
      model: "1U Blank Panel",
      weight: "0.2kg",
    },
  },
  {
    id: "blank-panel-2u",
    name: "2U Blank Panel",
    category: "blank",
    height: 2,
    width: 100,
    depth: 0,
    imageUrl: "/images/accessories/blank-panel-2u.jpg",
    specifications: {
      manufacturer: "Generic",
      model: "2U Blank Panel",
      weight: "0.4kg",
    },
  },
  {
    id: "shelf-1u",
    name: "1U Cantilever Shelf",
    category: "management",
    height: 1,
    width: 100,
    depth: 1,
    imageUrl: "/images/accessories/shelf-1u.jpg",
    specifications: {
      manufacturer: "Generic",
      model: "1U Shelf",
      capacity: "25kg load capacity",
      weight: "2.5kg",
    },
  },
  {
    id: "pdu-vertical",
    name: "Vertical PDU",
    category: "power",
    height: 42, // Full height
    width: 10, // Takes up side space
    depth: 1,
    imageUrl: "/images/accessories/pdu-vertical.jpg",
    specifications: {
      manufacturer: "APC",
      model: "AP8858",
      power: "30A 208V",
      ports: 24,
      weight: "8.2kg",
    },
  },
];

// Combined exports for easy importing
export const allComponents = [
  ...serverComponents,
  ...storageComponents,
  ...networkComponents,
  ...powerComponents,
  ...accessoryComponents,
];
