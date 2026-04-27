import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Search, LogOut, MessageSquare, User } from "lucide-react";

export default function Sidebar({ setSelectedUser, currentUser, onLogout }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      if (data) {
        setUsers(data.filter(u => u.id !== currentUser?.id));
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      // Fallback to empty list if table doesn't exist
      setUsers([]);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 bg-white/5 backdrop-blur-lg border-r border-white/10 flex flex-col h-full text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Messages</h1>
        </div>
        <button 
          onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-purple-300 hover:text-white"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-purple-300/50 w-4 h-4" />
          <input
            className="w-full bg-white/5 border border-white/10 p-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-purple-300/30"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filteredUsers.map((u) => (
          <button
            key={u.id}
            className="w-full p-3 flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-xl transition-all group"
            onClick={() => setSelectedUser(u)}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg border border-white/10">
              {u.username?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold group-hover:text-purple-300 transition-colors">{u.username || "Anonymous"}</div>
              <div className="text-xs text-purple-300/50 truncate">Click to start chatting</div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-purple-300/30 text-sm">
            No users found
          </div>
        )}
      </div>

      {/* Current User Info */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
            <User className="w-5 h-5 text-purple-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{currentUser?.email}</div>
            <div className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
