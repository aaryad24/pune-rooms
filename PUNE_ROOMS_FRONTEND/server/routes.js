const express = require("express");
const { createServer } = require("http");
const { storage } = require("./storage");
const { WebSocketServer, WebSocket } = require("ws");
const { insertUserSchema, insertRoomSchema, insertMessageSchema } = require("@shared/schema");

async function registerRoutes(app) {
  const httpServer = createServer(app);

  // WebSocket setup for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        const validMessage = insertMessageSchema.parse(message);
        const savedMessage = await storage.createMessage(validMessage);

        // Broadcast to all connected clients
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

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const lookingForRoom = req.query.lookingForRoom === "true";
      const users = await storage.getUsers(lookingForRoom);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });

  app.patch("/api/users/:id/status", async (req, res) => {
    try {
      const { isActive } = req.body;
      await storage.updateUserStatus(Number(req.params.id), isActive);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user status" });
    }
  });

  // Location routes
  app.get("/api/locations/suggestions", async (req, res) => {
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

  // Room routes
  app.get("/api/rooms", async (req, res) => {
    try {
      const { location, type, gender, maxPrice } = req.query;
      const rooms = await storage.getRooms();

      // Filter rooms based on search criteria
      const filteredRooms = rooms.filter((room) => {
        if (location && !room.location.toLowerCase().includes(String(location).toLowerCase()))
          return false;
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

  app.get("/api/rooms/:id", async (req, res) => {
    const room = await storage.getRoom(Number(req.params.id));
    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    res.json(room);
  });

  app.post("/api/rooms", async (req, res) => {
    try {
      const roomData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(roomData);
      res.json(room);
    } catch (error) {
      res.status(400).json({ error: "Invalid room data" });
    }
  });

  // Message routes
  app.get("/api/messages/:userId", async (req, res) => {
    const messages = await storage.getMessages(Number(req.params.userId));
    res.json(messages);
  });

  return httpServer;
}

module.exports = { registerRoutes };
