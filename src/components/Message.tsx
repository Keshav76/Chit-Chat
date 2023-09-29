import React, { useEffect, useState } from "react";
import timeSince from "../timeSince";
import { decryptData } from "../security";

type Props = {
  user: {
    uid: string;
    name: string;
    email: string;
    photo: string;
  };
  message: {
    senderContent: string;
    recieverContent: string;
    time: string;
    sender: string;
    img: boolean;
  };
  myPrivateKey: string;
  setImg: React.Dispatch<React.SetStateAction<string>>;
  setImgPage: React.Dispatch<React.SetStateAction<boolean>>;
};

const Message = ({
  setImg,
  setImgPage,
  user,
  message,
  myPrivateKey,
}: Props) => {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      if (message.sender === user.uid) {
        const m = await decryptData(message.senderContent, myPrivateKey);
        setMsg(m);
      } else {
        const m = await decryptData(message.recieverContent, myPrivateKey);
        setMsg(m);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={
        "flex flex-col mb-3" + (message.sender === user.uid ? " items-end" : "")
      }
    >
      <div
        className={
          "bg-light text-darkText p-2 max-w-[80%] w-max flex flex-col" +
          (message.sender === user.uid
            ? " items-end rounded-[16px_0_16px_16px]"
            : " rounded-[0_16px_16px_16px]")
        }
      >
        {!message.img && msg}
        {message.img && (
          <img
            width={200}
            src={msg}
            alt=""
            onClick={() => {
              setImg(msg);
              setImgPage(true);
            }}
            className="rounded-xl aspect-square object-contain hover:opacity-80 transition-opacity"
          />
        )}
      </div>
      <div className="text-xs text-gray-400">
        {timeSince(message.time) + " ago"}
      </div>
    </div>
  );
};

export default Message;
