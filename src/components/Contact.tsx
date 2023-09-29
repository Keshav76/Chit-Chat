type Props = {
  user: {
    uid: string;
    name: string;
    photo: string;
    email: string;
  };
};

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const Contact = ({ user }: Props) => {
  return (
    <div key={user.uid} className="p-2 hover:bg-dark flex gap-1">
      <div>
        <img
          alt=""
          src={user.photo}
          className="rounded-full w-10 aspect-square"
        />
      </div>
      <div>
        <div className="font-semibold text-xl">
          {capitalize(user.name.split(" ")[0])}
        </div>
        <div className="font-thin text-sm text-gray">{user.email}</div>
      </div>
    </div>
  );
};

export default Contact;
