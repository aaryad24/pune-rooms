var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { eq, like } from "drizzle-orm";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertLocationSchema: () => insertLocationSchema,
  insertMessageSchema: () => insertMessageSchema,
  insertRoomSchema: () => insertRoomSchema,
  insertUserSchema: () => insertUserSchema,
  locations: () => locations,
  messages: () => messages,
  rooms: () => rooms,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type").notNull()
  // area, suburb, city etc.
});
var users = pgTable("users", {
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
  isActive: boolean("is_active").default(true)
});
var rooms = pgTable("rooms", {
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
  roommatePreferences: text("roommate_preferences")
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});
var insertLocationSchema = createInsertSchema(locations);
var insertUserSchema = createInsertSchema(users).pick({
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
  lookingForRoom: true
}).refine(
  (data) => data.email || data.phone,
  {
    message: "Either email or phone number is required",
    path: ["contact"]
  }
);
var insertRoomSchema = createInsertSchema(rooms).pick({
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
  roommatePreferences: true
});
var insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  content: true
});

// server/db.ts
import dotenv from "dotenv";
dotenv.config();
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUsers(lookingForRoom) {
    return db.select().from(users).where(eq(users.lookingForRoom, lookingForRoom)).where(eq(users.isActive, true));
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUserStatus(userId, isActive) {
    await db.update(users).set({ isActive }).where(eq(users.id, userId));
  }
  async getRooms() {
    return db.select().from(rooms);
  }
  async getRoom(id) {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }
  async createRoom(insertRoom) {
    const [room] = await db.insert(rooms).values(insertRoom).returning();
    return room;
  }
  async getRoomsByOwner(ownerId) {
    return db.select().from(rooms).where(eq(rooms.ownerId, ownerId));
  }
  async getMessages(userId) {
    return db.select().from(messages).where(
      eq(messages.senderId, userId) || eq(messages.receiverId, userId)
    );
  }
  async createMessage(insertMessage) {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }
  async getLocationSuggestions(query) {
    return db.select().from(locations).where(like(locations.name, `${query}%`)).limit(5);
  }
  async createLocation(location) {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { WebSocketServer, WebSocket } from "ws";
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws2) => {
    ws2.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const validMessage = insertMessageSchema.parse(message);
        const savedMessage = await storage.createMessage(validMessage);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(savedMessage));
          }
        });
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const lookingForRoom = req.query.lookingForRoom === "true";
      const users2 = await storage.getUsers(lookingForRoom);
      res.json(users2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });
  app2.patch("/api/users/:id/status", async (req, res) => {
    try {
      const { isActive } = req.body;
      await storage.updateUserStatus(Number(req.params.id), isActive);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  });
  app2.get("/api/locations/suggestions", async (req, res) => {
    try {
      const { query } = req.query;
      if (typeof query !== "string") {
        res.status(400).json({ error: "Query parameter is required" });
        return;
      }
      const suggestions = await storage.getLocationSuggestions(query);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location suggestions" });
    }
  });
  app2.get("/api/rooms", async (req, res) => {
    try {
      const { location, type, gender, maxPrice } = req.query;
      const rooms2 = await storage.getRooms();
      const filteredRooms = rooms2.filter((room) => {
        if (location && !room.location.toLowerCase().includes(String(location).toLowerCase())) return false;
        if (type && room.type !== type) return false;
        if (gender && room.gender !== gender) return false;
        if (maxPrice && room.price > Number(maxPrice)) return false;
        return true;
      });
      res.json(filteredRooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  });
  app2.get("/api/rooms/:id", async (req, res) => {
    const room = await storage.getRoom(Number(req.params.id));
    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    res.json(room);
  });
  app2.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      res.json(room);
    } catch (error) {
      res.status(400).json({ error: "Invalid room data" });
    }
  });
  app2.get("/api/messages/:userId", async (req, res) => {
    const messages2 = await storage.getMessages(Number(req.params.userId));
    res.json(messages2);
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import "dotenv/config";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 4e3;
  server.listen(
    {
      port,
      host: "127.0.0.1"
      // Force IPv4
    },
    () => {
      log(`Server running on http://127.0.0.1:${port}`);
    }
  );
})();
