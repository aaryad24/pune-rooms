import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Home, Search, MessageSquare, User, Users } from "lucide-react";

export default function Layout({ children }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm-6 lg-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-2xl font-bold text-primary"
                >
                  PuneRooms
                </motion.div>
              </Link>
            </div>

            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                <NavigationMenuItem>
                  <Link href="/">
                    <NavigationMenuLink
                      className={`flex items-center gap-2 px-4 py-2 ${
                        location === "/" ? "text-primary" : ""
                      }`}
                    >
                      <Home size={20} />
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/listings">
                    <NavigationMenuLink
                      className={`flex items-center gap-2 px-4 py-2 ${
                        location === "/listings" ? "text-primary" : ""
                      }`}
                    >
                      <Search size={20} />
                      Find Rooms
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/roommate-finder">
                    <NavigationMenuLink
                      className={`flex items-center gap-2 px-4 py-2 ${
                        location === "/roommate-finder" ? "text-primary" : ""
                      }`}
                    >
                      <Users size={20} />
                      Find Roommates
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/messages">
                    <NavigationMenuLink
                      className={`flex items-center gap-2 px-4 py-2 ${
                        location === "/messages" ? "text-primary" : ""
                      }`}
                    >
                      <MessageSquare size={20} />
                      Messages
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/profile">
                    <NavigationMenuLink
                      className={`flex items-center gap-2 px-4 py-2 ${
                        location === "/profile" ? "text-primary" : ""
                      }`}
                    >
                      <User size={20} />
                      Profile
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm-6 lg-8 py-8">
        {children}
      </main>
    </div>
  );
}
