import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, MapPin, UserPlus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NewStudentForm from "./new-student-form";

function RoommateCard({ user, isAuthenticated }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.profilePicture || undefined} alt={user.fullName} />
              <AvatarFallback>{user.fullName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{user.fullName}</h3>
              {user.college && <p className="text-sm text-black">{user.college}</p>}
              {user.preferredLocation && (
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <MapPin size={16} className="text-black" />
                  <span>{user.preferredLocation}</span>
                </div>
              )}
              {user.budget && (
                <Badge variant="secondary" className="mt-2">
                  Budget: ₹{user.budget}/month
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="default" size="sm" className="gap-2">
                    <MessageSquare size={16} />
                    Message
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">View Details</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Contact Information</h4>
                          <p className="text-sm mt-1">Email: {user.email}</p>
                          {user.phone && <p className="text-sm">Phone: {user.phone}</p>}
                        </div>
                        {user.aboutYourself && (
                          <div>
                            <h4 className="font-semibold">About</h4>
                            <p className="text-sm mt-1">{user.aboutYourself}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <Button variant="outline" size="sm">Sign in to view</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function RoommateFinder() {
  const [view, setView] = useState("looking");
  const [locationFilter, setLocationFilter] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  useEffect(() => {
    if (locationFilter.length > 1) {
      fetch(`/api/locations/suggestions?query=${encodeURIComponent(locationFilter)}`)
        .then(res => res.json())
        .then(data => setLocationSuggestions(data))
        .catch(console.error);
    }
  }, [locationFilter]);

  const filteredUsers = users?.filter((user) => {
    if (!locationFilter) return true;
    return user.preferredLocation?.toLowerCase().includes(locationFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          variant={view === "looking" ? "default" : "outline"}
          onClick={() => setView("looking")}
        >
          Students Looking for Rooms
        </Button>
        <Button
          variant={view === "new-student" ? "default" : "outline"}
          onClick={() => setView("new-student")}
        >
          <UserPlus size={20} className="mr-2" />
          I'm New Here
        </Button>
      </div>

      {view === "new-student" ? (
        <NewStudentForm />
      ) : (
        <>
          <div className="max-w-sm">
            <Label>Filter by Location</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Input
                  placeholder="Enter location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="mt-2"
                />
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search for a location..." />
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    {locationSuggestions.map((loc) => (
                      <CommandItem
                        key={loc.name}
                        onSelect={() => {
                          setLocationFilter(loc.name);
                          setOpen(false);
                        }}
                      >
                        {loc.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-4">
            {filteredUsers?.map((user) => (
              <RoommateCard
                key={user.id}
                user={user}
                isAuthenticated={true} // TODO: Implement actual auth logic
              />
            ))}
            {(!filteredUsers || filteredUsers.length === 0) && (
              <p className="text-center text-black py-8">
                No students found in this category
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
