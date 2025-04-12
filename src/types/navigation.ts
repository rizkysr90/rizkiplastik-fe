import { ReactElement } from "react";

export interface SidebarLink {
  name: string;
  path: string;
  icon: ReactElement; // This will accept any React element, including Lucide icons
}
