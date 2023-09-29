import React, { useEffect, useState } from "react";
import SidebarToggle from "./SidebarToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPaperclip,
  faPhone,
  faRightFromBracket,
  faSmile as faSmileSolid,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { auth, db, storage } from "../firebase";

import Messages from "./Messages";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { encryptData } from "../security";

type User = {
  uid: string;
  name: string;
  email: string;
  photo: string;
  publicKey: string;
};

type Props = {
  user: User;
  chat: User;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<any | undefined>>;
};

const Main = ({ open, setOpen, user, chat, setUser }: Props) => {
  const [emojiPicker, setEmojiPicker] = React.useState(false);

  const [chatId, setChatId] = useState("");
  useEffect(() => {
    setChatId(chat.uid > user.uid ? chat.uid + user.uid : user.uid + chat.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  const logout = () => {
    setUser(null);
    auth.signOut();
  };

  const handleEmojiSelect = (emoji: any) => {
    const message = document.getElementById("message") as HTMLInputElement;
    message.value += emoji.native;
  };

  const handleMsgSend = async () => {
    const message = document.getElementById("message") as HTMLInputElement;
    const imgInput = document.getElementById("imgInput") as HTMLInputElement;
    let data;
    if (imgInput.files?.length) {
      const file = imgInput.files[0];
      imgInput.files = null;
      imgInput.value = "";

      const fileName = new Date().getTime() + "_" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => alert("Something went wrong"),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            data = {
              sender: user.uid,
              recieverContent: await encryptData(downloadURL, chat.publicKey),
              senderContent: await encryptData(downloadURL, user.publicKey),
              time: new Date().toString(),
              img: true,
            };
            updateDoc(doc(db, "chats", chatId), {
              messages: arrayUnion(data),
            });
          });
        }
      );
    } else {
      data = {
        sender: user.uid,
        recieverContent: await encryptData(message.value, chat.publicKey),
        senderContent: await encryptData(message.value, user.publicKey),
        time: new Date().toString(),
        img: false,
      };
      message.value = "";
      updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(data),
      });
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handleMsgSend();
    }
  };

  return (
    <div className="h-full">
      {/* TopBar */}
      <div className="bg-darkText  h-12 w-full flex justify-between px-3">
        <div className="flex items-center gap-5">
          <SidebarToggle open={open} setOpen={setOpen} />
          <div className="flex gap-2 items-center">
            {chat.photo && (
              <img
                src={chat.photo}
                alt={""}
                width={32}
                className=" aspect-square rounded-full"
              />
            )}
            {chat && chat.name}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <FontAwesomeIcon icon={faPhone} />
          <FontAwesomeIcon icon={faVideo} />
          <FontAwesomeIcon icon={faRightFromBracket} onClick={logout} />
        </div>
      </div>

      {/* Messages Section */}
      <Messages user={user} chatId={chatId} />

      {/* Input Section */}
      <div className="relative bg-darkText text-light h-12 w-full flex items-center justify-between px-3">
        <div
          id="emoji-picker"
          className="absolute top-[-450px]"
          style={{
            display: emojiPicker ? "block" : "none",
          }}
        >
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
        <div onClick={() => setEmojiPicker(!emojiPicker)}>
          <FontAwesomeIcon icon={emojiPicker ? faSmileSolid : faSmile} />
        </div>
        <input
          id="message"
          className="bg-inherit w-full h-full px-3 outline-none"
          type="text"
          placeholder="Type a message..."
          onKeyDown={(e) => handleEnter(e)}
        />
        <div className="flex gap-3">
          <label htmlFor="imgInput" className="cursor-pointer">
            <FontAwesomeIcon icon={faPaperclip} />
          </label>
          <input
            type="file"
            name="img"
            id="imgInput"
            onChange={handleMsgSend}
            className="hidden"
            accept="image/*"
          />
          <div onClick={handleMsgSend}>
            <FontAwesomeIcon icon={faPaperPlane} className="rotate-45 trans" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
