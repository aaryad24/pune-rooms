import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import MessageBubble from "@/components/message-bubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const opacity = 1;
const y = 0;

const currentUser = {
  id: 1, // Replace with valid ID
  username: "ARYAN_BHAIII",
  fullName: "ARYAN BHAAY",
  email: "ARYAN@gmail.com",
  password: "",
  bio: "Student At DYPCOE",
  college: "DYPCOE",
  profilePicture: "https://via.placeholder.com/40",
};

export default function Messages() {
  const [newMessage, setNewMessage] = useState("");

  const { data: messages } = useQuery({
    queryKey: [`/api/messages/${currentUser.id}`],
  });

  const { data: otherUser } = useQuery({
    queryKey: ["/api/users/2"],
  });

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  if (!otherUser) return <p>Loading user...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity, y }} animate={{ opacity, y }} className="border rounded-lg overflow-hidden">
        
        {/* Chat Header */}
        <div className="border-b p-4">
          <div className="flex items-center gap-4">
            <img
              src={otherUser.profilePicture || "https://via.placeholder.com/40"}
              alt={otherUser.fullName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold">{otherUser.fullName}</h2>
              <p className="text-sm text-black">{otherUser.college}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages?.map((message) => (
            <MessageBubble key={message.id} message={message} currentUser={currentUser} otherUser={otherUser} />
          ))}
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-4"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send size={20} />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
