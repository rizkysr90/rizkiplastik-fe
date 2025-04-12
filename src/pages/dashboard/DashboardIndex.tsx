import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./../../components/layout/Sidebar";
import { sidebarLinks } from "./../../config/navigation";

const DashboardIndex = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar
        links={sidebarLinks}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 p-6">
        {/* Outlet renders the matching child route */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardIndex;
