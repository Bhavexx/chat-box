export default function MessageBubble({ msg, currentUser }) {
  const isMe = msg.sender_id === currentUser?.id;

  return (
    <div className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
            isMe 
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none" 
              : "bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-tl-none"
          }`}
        >
          {msg.content}
        </div>

        <span className="text-[10px] text-purple-300/40 mt-1 px-1">
          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
