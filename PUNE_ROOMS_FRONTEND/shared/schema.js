import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type").notNull(), // area, suburb, city, etc.
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  aboutYourself: text("about_yourself"), 
  college: text("college"),
  profilePicture: text("profile_picture"),
  preferredLocation: text("preferred_location"),
  budget: integer("budget"),
  lookingForRoom: boolean("looking_for_room").default(false),
  isActive: boolean("is_active").default(true), 
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  location: text("location").notNull(),
  amenities: text("amenities").array().notNull(),
  images: text("images").array().notNull(),
  available: boolean("available").default(true),
  type: text("type").notNull(), 
  gender: text("gender").notNull(), 
  totalRoommates: integer("total_roommates").notNull(),
  currentRoommates: integer("current_roommates").notNull(),
  roommatePreferences: text("roommate_preferences"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schema for location suggestions
export const insertLocationSchema = createInsertSchema(locations);

// Updated user schema with either email or phone required
export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    fullName: true,
    email: true,
    phone: true,
    aboutYourself: true,
    college: true,
    profilePicture: true,
    preferredLocation: true,
    budget: true,
    lookingForRoom: true,
  })
  .refine(
    (data) => data.email || data.phone,
    {
      message: "Either email or phone number is required",
      path: ["contact"],
    }
  );

export const insertRoomSchema = createInsertSchema(rooms).pick({
  ownerId: true,
  title: true,
  description: true,
  price: true,
  location: true,
  amenities: true,
  images: true,
  type: true,
  gender: true,
  totalRoommates: true,
  currentRoommates: true,
  roommatePreferences: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  content: true,
});
