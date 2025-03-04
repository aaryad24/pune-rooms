import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoomCard from "@/components/room-card";
import { Pencil, LogOut } from "lucide-react";

// Default animation values
const opacity = 1;
const y = 0;
const delay = 0.2;

export default function Profile() {
  // Define state for the current user
  const [currentUser, setCurrentUser] = useState({
    id: "user1234", // Ensure an ID is assigned
    username: "ARYAN_24",
    fullName: "ARYAN",
    email: "aryan@gmail.com",
    password: "",
    college: "DYPCOE", // Initially set college to DYPCOE
    aboutYourself:
      "Information Technology student looking for accommodation near campus",
    profilePicture:
      "https://photoshulk.com/wp-content/uploads/instagram-pfp-cropper.jpg",
  });

  // Log the college to ensure it's set correctly
  console.log(currentUser.college); // Check if this logs "DYPCOE"

  // Fetch user rooms from API (or use mock data)
  const { data } = useQuery({
    queryKey: [`/api/rooms/owner/${currentUser.id}`],
  });

  const userRooms = data || [];

  useEffect(() => {
    // Simulate an API call to fetch user data (optional, if needed)
    const fetchUserData = async () => {
      const response = await fetch(`/api/users/${currentUser.id}`);
      const userData = await response.json();
      setCurrentUser(userData); // Update state with fetched user data
    };

    fetchUserData();
  }, [currentUser.id]); // Fetch data when the ID changes

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity, y }}
        animate={{ opacity, y }}
        className="flex items-center gap-6"
      >
        <img
          src={currentUser.profilePicture || "https://photoshulk.com/wp-content/uploads/instagram-pfp-cropper.jpg"}
          alt={currentUser.fullName}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1">
        <h1 className="text-3xl font-bold">{currentUser.fullName || "ARYAN"}</h1>
        <p className="text-black">{currentUser.college}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Pencil size={20} />
            Edit Profile
          </Button>
          <Button variant="destructive" className="gap-2">
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </motion.div>

      {/* Profile Content */}
      <motion.div
        initial={{ opacity, y }}
        animate={{ opacity, y }}
        transition={{ delay }}
      >
        <Tabs defaultValue="about">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <h3 className="font-semibold mb-2">About myself</h3>
                <p className="text-black">{currentUser.aboutYourself}</p>

                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-black">{currentUser.email}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <div className="grid md-cols-2 gap-6">
              {userRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity, y }}
                  animate={{ opacity, y }}
                  transition={{ delay: delay * 0.1 }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
              {userRooms.length === 0 && (
                <p className="text-black col-span-2 text-center py-8">
                  You haven't listed any rooms yet
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
