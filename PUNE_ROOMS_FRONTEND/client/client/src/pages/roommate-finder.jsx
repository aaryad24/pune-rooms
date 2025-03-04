import { motion } from "framer-motion";
import RoommateFinder from "@/components/roommate-finder";

export default function RoommatePage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity, y: -20 }}
        animate={{ opacity, y }}
      >
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Roommate</h1>
        <p className="text-black">
          Connect with students looking for roommates or offering shared accommodations in Pune
        </p>
      </motion.div>

      <RoommateFinder />
    </div>
  );
}
