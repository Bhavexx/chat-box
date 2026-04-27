import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Send, User, MessageCircle } from "lucide-react";
import { supabase } from "../services/supabase";

export default function ChatWindow({ user, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      // Subscribe to real-time messages
      const channel = supabase
        .channel(`chat-${selectedUser.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedUser]);

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    if (data) setMessages(data);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const { error } = await supabase.from("messages").insert([
      {
        content: text,
        sender_id: user.id,
        receiver_id: selectedUser.id,
      },
    ]);

    if (!error) setText("");
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white p-4">
        <div className="bg-white/5 p-10 rounded-3xl border border-white/10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl mb-6 shadow-xl shadow-indigo-500/20">
            <MessageCircle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Space</h2>
          <p className="text-purple-300/50 text-center max-w-xs">
            Select a contact from the sidebar to start a secure conversation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full relative overflow-hidden bg-white/5 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold border border-white/10">
            {selectedUser.username?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-white font-bold">{selectedUser.username || "Chat User"}</div>
            <div className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Active Now
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-2 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-purple-300/20 italic text-sm">
            No messages yet. Say hi!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} currentUser={user} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-6 bg-black/20">
        <div className="relative flex items-center gap-2">
          <input
            className="flex-1 bg-white/5 border border-white/10 p-3.5 pr-14 rounded-2xl text-white placeholder-purple-300/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
            placeholder={`Message ${selectedUser.username}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            disabled={!text.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
