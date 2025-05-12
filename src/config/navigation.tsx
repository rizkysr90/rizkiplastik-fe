// Import React to use JSX in the icons
import {
  BarChart2,
  LayoutDashboard,
  SatelliteDishIcon,
  Settings,
  SquareStackIcon,
} from "lucide-react";
import { SidebarLink } from "./../components/layout/Sidebar";

export const sidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Online Transactions",
    path: "/dashboard/online-transactions",
    icon: <SatelliteDishIcon size={20} />,
  },
  {
    name: "Auto Input",
    path: "/dashboard/online-transactions/auto-input",
    icon: <SatelliteDishIcon size={20} />,
  },
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: <BarChart2 size={20} />,
  },
  {
    name: "Products",
    path: "/dashboard/products",
    icon: <SquareStackIcon size={20} />,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: <Settings size={20} />,
  },
];
