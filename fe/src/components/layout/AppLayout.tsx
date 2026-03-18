import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./SideBar";
import { TopBar } from "./TopBar";

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4ff]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
