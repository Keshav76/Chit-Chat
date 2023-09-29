import { signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, provider } from "../firebase";

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { getKeys } from "../security";

import laptop from "../images/laptop.png";
import phone from "../images/phone.png";

type User = {
  uid: string;
  name: string;
  email: string;
  photo: string;
  publicKey: string;
};

type Props = {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const Login = ({ setUser }: Props) => {
  const login = async () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const already = await getDocs(
          query(collection(db, "users"), where("uid", "==", user.uid))
        );
        let publicKey: string = "",
          privateKey: string = "";
        if (already.empty) {
          const x = await getKeys();
          publicKey = x.publicKey;
          privateKey = x.privateKey;
          setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            publicKey: publicKey,
          });
          setDoc(doc(db, "privateKeys", user.uid), {
            uid: user.uid,
            privateKey: privateKey,
          });
        }
        updateDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          photo: user.photoURL,
        });
        const res = await getDoc(doc(db, "contacts", user.uid));
        if (!res.exists()) {
          setDoc(doc(db, "contacts", user.uid), {
            list: [],
          });
        }

        // final updated user
        await getDoc(doc(db, "users", user.uid)).then((data) => {
          const d = data.data() as User;
          setUser({
            uid: d.uid,
            name: d.name,
            email: d.email,
            photo: d.photo,
            publicKey: d.publicKey,
          });
        });
      })
      .catch((error) => console.warn);
  };

  const [big, setBig] = React.useState(true);

  useEffect(() => {
    window.onresize = () => {
      setBig(window.innerWidth > 768);
    };
    setBig(window.innerWidth > 768);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div>
        <img
          src={big ? laptop : phone}
          alt=""
          className="block align-bottom h-80 md:h-auto md:w-[50vw] drop-shadow-[0px_0px_15px_#001]"
        />
      </div>

      <div className="flex flex-col gap-5 py-3">
        <div className="text-light text-center font-extrabold text-5xl">
          Chit Chat
        </div>
        <div className="text-light text-center font-bold text-xl">
          Chat Your Way to Connection!
        </div>
        <button
          className="bg-light text-darkText px-10 py-3 rounded-full"
          onClick={login}
        >
          <FontAwesomeIcon icon={faGoogle} className="mr-3" />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
