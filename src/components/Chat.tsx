import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Main from "./Main";

type User = {
  uid: string;
  name: string;
  email: string;
  photo: string;
  publicKey: string;
};

type Props = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const Chat = ({ user, setUser }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [chat, setChat] = useState<User>({
    uid: "",
    name: "",
    email: "",
    photo: "",
    publicKey: "",
  });
  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* Sidebar */}
      <div
        className="w-full sm:w-80 flex-shrink-0 h-full text-light bg-darkText transition-all duration-300"
        id="sidebar"
      >
        <Sidebar open={open} setOpen={setOpen} user={user} setChat={setChat} />
      </div>

      {/* Main */}
      <div className="text-light overflow-hidden grow">
        <Main
          open={open}
          setOpen={setOpen}
          user={user}
          chat={chat}
          setUser={setUser}
        />
      </div>
    </div>
  );
};

export default Chat;
