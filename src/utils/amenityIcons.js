/**
 * Maps OwnerRez amenity name strings → Lucide React icon components.
 * Keys are lower-cased for case-insensitive matching.
 * Unrecognized amenities fall back to `CheckCircle`.
 */
import {
  Wifi,
  Car,
  Waves,
  Wind,
  Tv,
  Coffee,
  UtensilsCrossed,
  WashingMachine,
  Dumbbell,
  Dog,
  Baby,
  Flame,
  Thermometer,
  Bath,
  Shirt,
  Laptop,
  Lock,
  Telescope,
  Bed,
  Users,
  TreePine,
  Droplets,
  ShieldCheck,
  CheckCircle,
  MonitorSpeaker,
  Refrigerator,
  ChefHat,
  BriefcaseMedical,
  Footprints,
} from 'lucide-react';

const AMENITY_MAP = {
  // Connectivity
  wifi: Wifi,
  'high-speed internet': Wifi,
  internet: Wifi,
  'wireless internet': Wifi,

  // Parking
  parking: Car,
  'free parking': Car,
  'parking on premises': Car,
  garage: Car,
  'ev charger': Car,

  // Pool / hot tub
  pool: Waves,
  'swimming pool': Waves,
  'hot tub': Droplets,
  jacuzzi: Droplets,

  // Climate
  'air conditioning': Wind,
  ac: Wind,
  'central air': Wind,
  heating: Thermometer,
  'central heating': Thermometer,

  // Entertainment
  tv: Tv,
  television: Tv,
  'cable tv': Tv,
  'streaming services': MonitorSpeaker,
  netflix: MonitorSpeaker,

  // Kitchen
  kitchen: UtensilsCrossed,
  'full kitchen': UtensilsCrossed,
  'kitchen essentials': UtensilsCrossed,
  'coffee maker': Coffee,
  'espresso machine': Coffee,
  'drip coffee maker': Coffee,
  refrigerator: Refrigerator,
  dishwasher: ChefHat,
  microwave: ChefHat,
  oven: ChefHat,
  stove: ChefHat,

  // Laundry
  washer: WashingMachine,
  dryer: Shirt,
  'washer/dryer': WashingMachine,
  laundry: WashingMachine,

  // Fitness
  gym: Dumbbell,
  'fitness center': Dumbbell,
  'exercise equipment': Dumbbell,

  // Pets
  'pets allowed': Dog,
  'pet friendly': Dog,
  'dogs allowed': Dog,

  // Family
  'crib available': Baby,
  'high chair': Baby,
  'pack-n-play': Baby,

  // Outdoor
  bbq: Flame,
  grill: Flame,
  'barbecue grill': Flame,
  backyard: TreePine,
  patio: TreePine,
  deck: TreePine,
  balcony: Telescope,

  // Bathing
  bathtub: Bath,
  'soaking tub': Bath,
  shower: Bath,

  // Work
  'dedicated workspace': Laptop,
  'home office': Laptop,
  desk: Laptop,

  // Safety
  'smoke detector': ShieldCheck,
  'carbon monoxide detector': ShieldCheck,
  'fire extinguisher': BriefcaseMedical,
  'first aid kit': BriefcaseMedical,

  // Security
  keypad: Lock,
  'self check-in': Lock,
  'smart lock': Lock,

  // Sleep
  'bed linens': Bed,
  'extra pillows': Bed,
  'hair dryer': Users,

  // Beach / outdoors
  'beach access': Footprints,
  'lake access': Footprints,
};

/**
 * Returns the Lucide icon component for a given amenity name.
 * @param {string} amenityName
 * @returns {React.ComponentType}
 */
export function getAmenityIcon(amenityName) {
  const key = (amenityName ?? '').toLowerCase().trim();
  return AMENITY_MAP[key] ?? CheckCircle;
}
