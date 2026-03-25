import { getUser } from "../auth/auth";

const Navbar = () => {
  const user = getUser();

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between">
      <h2 className="font-semibold">Dashboard</h2>
      <p className="text-gray-600">Welcome, {user?.name}</p>
    </div>
  );
};

export default Navbar;
