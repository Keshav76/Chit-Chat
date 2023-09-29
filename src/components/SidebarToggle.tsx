import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarToggle = ({ open, setOpen }: Props) => {
  const handleClick = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      if (window.innerWidth < 640) {
        sidebar.style.width = open ? "0px" : "100vw";
      } else {
        sidebar.style.width = open ? "0px" : "320px";
      }
      setOpen(!open);
    }
  };
  return (
    <button className="" onClick={handleClick}>
      <FontAwesomeIcon icon={faBars} />
    </button>
  );
};

export default SidebarToggle;
