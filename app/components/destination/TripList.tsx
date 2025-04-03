import TripCard from './TripCard';

interface Trip {
  "trip-name": string;
  price: number;
  duration: string;
  amenities: string[];
  image?: string; // Optional since it's not in the API response
}

interface TripListProps {
  handle: string;
}

// Mapping of destinations to high-quality Unsplash images
const destinationImages: Record<string, string[]> = {
  'egypt': [
    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=1920', // Pyramids
    'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=1920', // Nile
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1920'     // Temple
  ],
  'bhutan': [
    'https://images.unsplash.com/photo-1580181630026-6b4c4afd8ecd?q=80&w=1920', // Tiger's Nest
    'https://images.unsplash.com/photo-1622449510431-8b8b0c89f4fc?q=80&w=1920', // Temple
    'https://images.unsplash.com/photo-1625903657496-dd04a3666e0e?q=80&w=1920'  // Mountains
  ],
  'maldives': [
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920', // Overwater villa
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1920', // Beach
    'https://images.unsplash.com/photo-1578922746465-3a80a228f223?q=80&w=1920'  // Aerial view
  ],
  'bali': [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1920', // Temple
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=1920',    // Rice fields
    'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=1920'  // Beach
  ],
  'dubai': [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1920', // Burj Khalifa
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1920',    // Desert
    'https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=1920'  // Marina
  ],
  'japan': [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1920', // Tokyo
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1920',    // Mt. Fuji
    'https://images.unsplash.com/photo-1478436127897-769e1538f3f1?q=80&w=1920'  // Temple
  ]
};

// Default image if destination not found in mapping
const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1920';

async function getTrips(handle: string): Promise<Trip[]> {
  try {
    const response = await fetch(
      `https://json-data-1wm2.onrender.com/destination/${handle}`,
      { 
        next: { revalidate: 3600 }, // Revalidate every hour
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trips: ${response.statusText}`);
    }

    const data = await response.json();
    return data.trips || []; // Access the trips array from the response
  } catch (error) {
    console.error('Error fetching trips:', error);
    return []; // Return empty array on error
  }
}

export default async function TripList({ handle }: TripListProps) {
  const trips = await getTrips(handle);

  if (!trips.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No trips available for this destination at the moment.
        </p>
      </div>
    );
  }

  // Get destination images or use default images
  const destinationPhotos = destinationImages[handle.toLowerCase()] || [defaultImage];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip, index) => (
        <TripCard 
          key={index} 
          trip={{
            id: index,
            name: trip["trip-name"],
            price: trip.price,
            duration: parseInt(trip.duration),
            amenities: trip.amenities,
            image: trip.image || destinationPhotos[index % destinationPhotos.length] // Cycle through available images
          }} 
        />
      ))}
    </div>
  );
} 