import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
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

export default function SearchFilters({ onFilterChange }) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState([5000, 50000]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (location.length > 1) {
      fetch(`/api/locations/suggestions?query=${encodeURIComponent(location)}`)
        .then((res) => res.json())
        .then((data) => setLocationSuggestions(data))
        .catch(console.error);
    }
  }, [location]);

  const handleSearch = () => {
    onFilterChange({
      location,
      type,
      gender,
      maxPrice: price[1],
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <div className="space-y-2">
            <Label>Location</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Input
                  placeholder="Search location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                          setLocation(loc.name);
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

          <div className="space-y-2">
            <Label>Room Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PG">PG</SelectItem>
                <SelectItem value="1BHK">1 BHK</SelectItem>
                <SelectItem value="2BHK">2 BHK</SelectItem>
                <SelectItem value="3BHK">3 BHK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Price Range</Label>
            <Slider
              min={5000}
              max={50000}
              step={1000}
              value={price}
              onValueChange={setPrice}
              className="mt-6"
            />
            <div className="flex justify-between mt-2 text-sm text-black">
              <span>₹{price[0]}</span>
              <span>₹{price[1]}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-end"
        >
          <Button onClick={handleSearch} className="gap-2">
            <Search size={20} />
            Search Rooms
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
