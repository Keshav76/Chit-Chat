import React, { useEffect, useState } from "react";
import Contact from "./Contact";
import Topbar from "./Topbar";
import SearchNewUser from "./SearchNewUser";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

type Props = {
  user: User;
  open: boolean;
  setChat: React.Dispatch<React.SetStateAction<User>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type User = {
  uid: string;
  name: string;
  email: string;
  photo: string;
  publicKey: string;
};

const Sidebar = ({ setOpen, open, user, setChat }: Props) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    const contactsRef = collection(db, "contacts");
    const res = (await getDoc(doc(contactsRef, user.uid))).data();
    if (res) setContacts(res.list);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chatChange = (user: User) => {
    setChat(user);
    if (window.innerWidth < 640) {
      const sidebar = document.getElementById("sidebar") as HTMLDivElement;
      sidebar.style.width = "0px";
      setOpen(!open);
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden">
      {/* TopBar */}
      <Topbar setChat={setChat} setQuery={setQuery} />
      {/* Contacts */}
      <div className="h-[calc(100vh-48px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-thumb-rounded-2xl">
        {contacts
          .filter((user) =>
            user.name.toLowerCase().includes(query.toLowerCase())
          )
          .map((user) => (
            <div onClick={() => chatChange(user)} key={user.uid}>
              <Contact key={user.uid} user={user} />
            </div>
          ))}
      </div>
      {/* Search New User */}
      <div className="absolute bottom-0 right-0">
        <SearchNewUser user={user} setContacts={setContacts} />
      </div>
    </div>
  );
};

export default Sidebar;
