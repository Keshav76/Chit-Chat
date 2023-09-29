"useClient";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import {
  collection,
  doc,
  documentId,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

type MessageForm = {
  recieverContent: string;
  senderContent: string;
  sender: string;
  time: string;
  img: boolean;
};

type Props = {
  user: {
    uid: string;
    name: string;
    email: string;
    photo: string;
  };
  chatId: string;
};

const Messages = ({ user, chatId }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageForm[]>([]);
  const [myPrivateKey, setMyPrivateKey] = useState("");
  const [img, setImg] = useState("");
  const [imgPage, setImgPage] = useState(false);
  const fetchData = async () => {
    if (chatId.includes("undefined")) return;

    const res = await getDoc(doc(db, "privateKeys", user.uid));
    if (res.exists()) {
      setMyPrivateKey(res.data().privateKey);
    }

    try {
      const messagesRef = collection(db, "chats");
      const q = query(messagesRef, where(documentId(), "==", chatId));
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          setMessages(change.doc.data().messages);
        });
      });
    } catch (err) {}
  };
  useEffect(() => {
    setMessages((prev) => []);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "auto", block: "center" });
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <>
      {imgPage && (
        <div className="h-[calc(100%-96px)] flex-grow items-center justify-between relative bg-darkText flex">
          <img src={img} alt="" className="h-full w-auto max-w-full mx-auto" />
          <FontAwesomeIcon
            icon={faClose}
            onClick={() => setImgPage(false)}
            size="2xl"
            className="absolute top-10 right-10 cursor-pointer text-light hover:bg-dark rounded-full aspect-square p-2"
          />
        </div>
      )}
      {!imgPage && (
        <div className="bg-[url('./images/bg.png')] h-[calc(100%-96px)] flex-grow bg-dark p-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-thumb-rounded-2xl">
          {messages &&
            messages.map((_, i) => (
              <Message
                setImg={setImg}
                setImgPage={setImgPage}
                user={user}
                message={_}
                key={"message " + i}
                myPrivateKey={myPrivateKey}
              />
            ))}
          <div ref={ref} />
        </div>
      )}
    </>
  );
};

export default Messages;
