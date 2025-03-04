import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import SearchFilters from "@/components/search-filters";
import RoomCard from "@/components/room-card";
import { Skeleton } from "@/components/ui/skeleton";

const opacity = 1;
const y = 0;
const delay = 0.1;

export default function Listings() {
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["/api/rooms", filters],
  });

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity, y: -20 }} animate={{ opacity, y }}>
        <h1 className="text-3xl font-bold mb-6">Available Rooms</h1>
        <SearchFilters onFilterChange={setFilters} />
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ delay: delay * 0.1 }}
            >
              <RoomCard room={room} />
            </motion.div>
          ))}
          {(!data || data.length === 0) && (
            <p className="col-span-3 text-center text-black py-8">
              No rooms found matching your criteria.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
