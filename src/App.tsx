import { useState } from "react";
import Chat from "./components/Chat";
import Login from "./components/Login";

type User = {
  uid: string;
  name: string;
  email: string;
  photo: string;
  publicKey: string;
};

function App() {
  const [user, setUser] = useState<User>();
  return (
    <div className="bg-dark w-screen h-screen flex items-center justify-center">
      {!user && <Login setUser={setUser} />}
      {user && <Chat user={user} setUser={setUser} />}
    </div>
  );
}

export default App;
