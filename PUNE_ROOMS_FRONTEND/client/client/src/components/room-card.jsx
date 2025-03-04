import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";

export default function RoomCard({ room }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={room.images[0]}
            alt={room.title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">{room.title}</h3>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin size={16} />
            <span className="text-sm">{room.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <HomeIcon size={16} />
            <span className="text-sm">{room.type}</span>
          </div>
          <p className="mt-4 text-xl font-bold">₹{room.price}/month</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Link href={`/room/${room.id}`}>
            <Button className="w-full">View Details</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
