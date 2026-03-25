import { LayoutDashboard, Folder, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-5">
      <h1 className="text-2xl font-bold text-indigo-600 mb-8">
        ProTool 🚀
      </h1>

      <nav className="space-y-3">
        <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
          <Folder size={18} />
          <span>Projects</span>
        </div>

        <div className="flex items-center gap-3 p-2 rounded text-red-500 hover:bg-red-50 cursor-pointer">
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </nav>
    </aside>
  );
}
