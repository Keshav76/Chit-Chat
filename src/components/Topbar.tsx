import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

type User = {
  uid: string;
  name: string;
  email: string;
  photo: string;
  publicKey: string;
};

type Props = {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setChat: React.Dispatch<React.SetStateAction<User>>;
};

const Topbar = ({ setQuery, setChat }: Props) => {
  const [searchOpen, setSearchOpen] = useState(true);
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);

    const inp = document.getElementById("searchBar") as HTMLInputElement;
    inp.style.width = searchOpen ? "100%" : "0px";
    inp.style.paddingTop = "0.2rem";
    inp.style.paddingBottom = "0.2rem";
    inp.style.paddingLeft = searchOpen ? "0.5rem" : "0px";
    inp.style.paddingRight = searchOpen ? "0.5rem" : "0px";
    inp.focus();

    const logo = document.getElementById("logo") as HTMLDivElement;
    logo.style.width = searchOpen ? "0px" : "100%";
  };

  return (
    <div className="px-4 h-12 flex justify-between items-center">
      <div
        id="logo"
        onClick={() =>
          setChat({
            uid: "",
            name: "",
            email: "",
            photo: "",
            publicKey: "",
          })
        }
        className="cursor-pointer font-extrabold text-2xl overflow-hidden transition-all whitespace-nowrap"
      >
        Chatting App
      </div>
      <input
        id="searchBar"
        type="text"
        className="w-0 transition-all m-2 rounded-xl bg-dark text-lightText"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={toggleSearch}>
        <FontAwesomeIcon icon={searchOpen ? faSearch : faClose} />
      </button>
    </div>
  );
};

export default Topbar;
