import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, MessageSquare, UserPlus } from "lucide-react";

const opacity = 1;
const y = 0;
const x = 0;
const delay = 0.1;

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.h1
          initial={{ opacity, y }}
          animate={{ opacity, y }}
          className="text-4xl md:text-6xl font-bold text-black"
        >
          Find Your Perfect Room in Pune
        </motion.h1>
        <motion.p
          initial={{ opacity, y }}
          animate={{ opacity, y }}
          transition={{ delay: delay * 1 }}
          className="text-xl text-gray-700 max-w-2xl mx-auto"
        >
          Connect with fellow students and find the ideal accommodation for your studies
        </motion.p>
        <motion.div
          initial={{ opacity, y }}
          animate={{ opacity, y }}
          transition={{ delay: delay * 2 }}
        >
          <Link href="/listings">
            <Button size="lg" className="gap-2">
              Browse Rooms <ArrowRight size={20} />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity, x: -20 }}
          animate={{ opacity, x }}
          transition={{ delay: delay * 3 }}
        >
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <Search size={40} className="mx-auto text-primary" />
              <h3 className="text-xl font-semibold text-black">Easy Search</h3>
              <p className="text-gray-800">
                Find rooms that match your preferences with our powerful search filters
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity, y }}
          animate={{ opacity, y }}
          transition={{ delay: delay * 4 }}
        >
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <MessageSquare size={40} className="mx-auto text-primary" />
              <h3 className="text-xl font-semibold text-black">Direct Messaging</h3>
              <p className="text-gray-800">
                Connect directly with room owners through our messaging system
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity, x }}
          animate={{ opacity, x }}
          transition={{ delay: delay * 5 }}
        >
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <UserPlus size={40} className="mx-auto text-primary" />
              <h3 className="text-xl font-semibold text-black">Student Community</h3>
              <p className="text-gray-800">
                Join a community of students looking for the perfect accommodation
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Featured Locations */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Popular Areas in Pune</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "City Center",
              image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
            },
            {
              name: "Koregaon Park",
              image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
            },
            {
              name: "Baner",
              image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
            },
            {
              name: "Viman Nagar",
              image: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21",
            },
          ].map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              transition={{ delay: delay * (2 + index) }}
              className="relative overflow-hidden rounded-lg aspect-[4/3] group cursor-pointer"
            >
              <img
                src={location.image}
                alt={location.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{location.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
