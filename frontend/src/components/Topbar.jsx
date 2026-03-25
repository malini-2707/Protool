import { jwtDecode } from "jwt-decode";

export default function Topbar() {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            {user.email[0].toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
