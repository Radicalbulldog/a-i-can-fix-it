import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Contractor {
  id: string; name: string; specialty: string; rating: number; reviewCount: number;
  phone: string; address: string; lat: number; lng: number; description: string;
  yearsInBusiness: number; licensed: boolean; insured: boolean;
}

const CONTRACTORS: Contractor[] = [
  { id: '1', name: "Mike's Plumbing Pro", specialty: 'plumbing', rating: 4.8, reviewCount: 234, phone: '(555) 100-0001', address: '123 Main St', lat: 40.7128, lng: -74.006, description: 'Full-service plumbing: leaks, clogs, water heaters, pipe replacement.', yearsInBusiness: 15, licensed: true, insured: true },
  { id: '2', name: 'Spark Electric Co', specialty: 'electrical', rating: 4.9, reviewCount: 189, phone: '(555) 100-0002', address: '456 Oak Ave', lat: 40.7148, lng: -74.008, description: 'Residential electrical: wiring, panels, outlets, lighting, smart home.', yearsInBusiness: 22, licensed: true, insured: true },
  { id: '3', name: 'Cool Breeze HVAC', specialty: 'hvac', rating: 4.7, reviewCount: 312, phone: '(555) 100-0003', address: '789 Elm Blvd', lat: 40.7108, lng: -74.004, description: 'Heating & cooling: AC repair, furnace install, duct cleaning.', yearsInBusiness: 18, licensed: true, insured: true },
  { id: '4', name: 'TopNotch Roofing', specialty: 'roofing', rating: 4.6, reviewCount: 156, phone: '(555) 100-0004', address: '321 Pine Rd', lat: 40.7168, lng: -74.010, description: 'Roof repair, replacement, gutter install, leak detection.', yearsInBusiness: 25, licensed: true, insured: true },
  { id: '5', name: 'HandyMan Heroes', specialty: 'general', rating: 4.5, reviewCount: 478, phone: '(555) 100-0005', address: '654 Maple Dr', lat: 40.7138, lng: -74.002, description: 'General repairs: drywall, painting, doors, windows, fixtures.', yearsInBusiness: 10, licensed: true, insured: true },
  { id: '6', name: 'FloorCraft Pros', specialty: 'flooring', rating: 4.8, reviewCount: 201, phone: '(555) 100-0006', address: '987 Cedar Ln', lat: 40.7188, lng: -74.012, description: 'Hardwood, tile, laminate, vinyl flooring install & repair.', yearsInBusiness: 12, licensed: true, insured: true },
  { id: '7', name: 'PaintPerfect LLC', specialty: 'painting', rating: 4.7, reviewCount: 167, phone: '(555) 100-0007', address: '147 Birch Way', lat: 40.7098, lng: -74.001, description: 'Interior/exterior painting, staining, wallpaper, texture repair.', yearsInBusiness: 8, licensed: true, insured: true },
  { id: '8', name: 'AquaGuard Plumbing', specialty: 'plumbing', rating: 4.6, reviewCount: 143, phone: '(555) 100-0008', address: '258 Walnut St', lat: 40.7158, lng: -74.015, description: 'Emergency plumbing, sewer line, bathroom & kitchen remodel.', yearsInBusiness: 20, licensed: true, insured: true },
  { id: '9', name: 'BrightWire Electric', specialty: 'electrical', rating: 4.5, reviewCount: 98, phone: '(555) 100-0009', address: '369 Spruce Ct', lat: 40.7118, lng: -74.009, description: 'Electrical upgrades, EV charger install, generator hookup.', yearsInBusiness: 6, licensed: true, insured: true },
  { id: '10', name: 'AllStar Home Repair', specialty: 'general', rating: 4.9, reviewCount: 567, phone: '(555) 100-0010', address: '480 Aspen Pl', lat: 40.7178, lng: -74.007, description: 'Complete home repair: plumbing, electrical, carpentry, painting.', yearsInBusiness: 30, licensed: true, insured: true },
  { id: '11', name: 'GreenLeaf Landscaping', specialty: 'exterior', rating: 4.4, reviewCount: 89, phone: '(555) 100-0011', address: '591 Willow Run', lat: 40.7200, lng: -74.003, description: 'Landscaping, fencing, deck repair, outdoor structures.', yearsInBusiness: 14, licensed: true, insured: true },
  { id: '12', name: 'TileWorks Studio', specialty: 'flooring', rating: 4.8, reviewCount: 112, phone: '(555) 100-0012', address: '702 Poplar Ave', lat: 40.7080, lng: -74.011, description: 'Custom tile, backsplash, shower remodel, grout repair.', yearsInBusiness: 16, licensed: true, insured: true },
];

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const category = req.query.category as string | undefined;

  if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ error: 'lat and lng required' });

  const results = CONTRACTORS
    .map(c => ({ ...c, distance: haversine(lat, lng, c.lat, c.lng) }))
    .filter(c => c.distance <= 50)
    .filter(c => !category || category === 'all' || c.specialty === category || c.specialty === 'general')
    .sort((a, b) => b.rating - a.rating);

  res.json(results);
}
