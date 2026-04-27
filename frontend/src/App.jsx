import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chats";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  if (user) return <Chat user={user} />;

  return showSignup ? (
    <Signup setUser={setUser} onBack={() => setShowSignup(false)} />
  ) : (
    <Login setUser={setUser} onShowSignup={() => setShowSignup(true)} />
  );
}

export default App;
