const { eq, like } = require("drizzle-orm");
const { db } = require("./db");
const { locations, users, rooms, messages } = require("@shared/schema");

class DatabaseStorage {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUsers(lookingForRoom) {
    return db
      .select()
      .from(users)
      .where(eq(users.lookingForRoom, lookingForRoom))
      .where(eq(users.isActive, true));
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
    return db
      .select()
      .from(messages)
      .where(eq(messages.senderId, userId) || eq(messages.receiverId, userId));
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
}

const storage = new DatabaseStorage();

module.exports = { storage };
