import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Chat({ user }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      <Sidebar setSelectedUser={setSelectedUser} currentUser={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow user={user} selectedUser={selectedUser} />
      </div>
    </div>
  );
}
