import { db } from "../firebase";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  query,
  where,
  collection,
  getDocs,
  setDoc,
  doc,
  arrayUnion,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import React from "react";

type User = {
  uid: string;
  name: string;
  email: string;
  photo: string;
  publicKey: string;
};

type Props = {
  user: User;
  setContacts: React.Dispatch<React.SetStateAction<User[]>>;
};

const SearchNewUser = ({ user, setContacts }: Props) => {
  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Escape") return toggleSearch();
    if (e.code === "Enter") {
      const q = query(
        collection(db, "users"),
        where("email", "==", e.currentTarget.value)
      );
      try {
        const ans = await getDocs(q);
        if (ans.empty) return alert("No such user!");
        if (ans.docs[0].data().uid === user.uid) {
          return alert("You can't add yourself!");
        }
        let newContact: any = {};
        (document.getElementById("newUserSearch") as HTMLInputElement).value =
          "";
        toggleSearch();
        ans.forEach((d) => {
          newContact = {
            uid: d.data().uid,
            name: d.data().name,
            email: d.data().email,
            photo: d.data().photo,
            publicKey: d.data().publicKey,
          };
        });
        setContacts((prev) => [
          newContact,
          ...prev.filter((c) => c.uid !== newContact.uid),
        ]);
        updateDoc(doc(db, "contacts", user.uid), {
          list: arrayUnion(newContact),
        });
        updateDoc(doc(db, "contacts", newContact.uid), {
          list: arrayUnion(user),
        });

        const chatId =
          newContact.uid > user.uid
            ? newContact.uid + user.uid
            : user.uid + newContact.uid;
        const chats = await getDoc(doc(db, "chats", chatId));
        if (!chats.exists()) {
          setDoc(doc(db, "chats", chatId), {
            messages: [],
          });
        }
      } catch (err) {}
    }
  };

  let open = true;
  const toggleSearch = () => {
    const search = document.getElementById("newUserSearch");
    if (search) {
      search.style.width = open ? "256px" : "0px";
      search.style.height = open ? "40px" : "0px";
      if (open) search.focus();
      open = !open;
    }
  };

  return (
    <div className="flex flex-col items-end mr-6 mb-4 gap-2">
      <input
        id="newUserSearch"
        type="text"
        placeholder="Enter email address..."
        onKeyDown={(e) => handleSearch(e)}
        className="rounded-full h-0 px-5 w-0 whitespace-nowrap text-darkText bg-light border-none outline-none caret-zinc-500 placeholder-zinc-500 transition-all duration-200"
      />
      <div
        className="flex items-center justify-center rounded-full bg-light text-darkText w-12 h-12"
        onClick={toggleSearch}
      >
        <FontAwesomeIcon icon={faPencil} className="text-lg" />
      </div>
    </div>
  );
};

export default SearchNewUser;
