import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageGallery from "@/components/image-gallery";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Home as HomeIcon, UserCircle, Phone } from "lucide-react";

const opacity = 1;
const y = 0;
const x = 0;

export default function RoomDetails() {
  const params = useParams();
  const { id } = params;
  
  const { data: room, isLoading } = useQuery({
    queryKey: [`/api/rooms/${id}`],
  });

  const { data: owner } = useQuery({
    queryKey: [`/api/users/${room?.ownerId}`],
    enabled: !!room?.ownerId,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[400px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity }} animate={{ opacity }}>
        <ImageGallery images={room.images} />
      </motion.div>

      <motion.div initial={{ opacity, y }} animate={{ opacity, y }} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold mb-4">{room.title}</h1>
          <div className="flex items-center gap-4 text-black">
            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <span>{room.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <HomeIcon size={20} />
              <span>{room.type}</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <p className="text-black">{room.description}</p>

          <h2 className="text-xl font-semibold mb-3">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity, x }} animate={{ opacity, x }} transition={{ delay: 0.2 }}>
          <div className="sticky top-6 space-y-6 p-6 border rounded-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold">₹{room.price}/month</h2>
              <p className="text-black">Including all utilities</p>
            </div>

            {owner && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Listed by</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={owner.profilePicture || "https://via.placeholder.com/40"}
                    alt={owner.fullName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{owner.fullName}</p>
                    <p className="text-sm text-black">{owner.college}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button className="flex-1 gap-2">
                <Phone size={20} />
                Contact
              </Button>
              <Button className="flex-1 gap-2" variant="outline">
                <UserCircle size={20} />
                View Profile
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
