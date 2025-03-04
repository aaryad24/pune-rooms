import { motion } from "framer-motion";
import { format } from "date-fns";

export default function MessageBubble({ message, currentUser, otherUser }) {
  const isOwnMessage = message.senderId === currentUser.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] ${
          isOwnMessage ? "bg-primary text-black" : "bg-secondary text-black"
        } rounded-lg px-4 py-2`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp ? format(message.timestamp, "HH:mm") : ""}
        </p>
      </div>
    </motion.div>
  );
}
