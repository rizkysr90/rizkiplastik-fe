import { ReactElement, useState } from "react";
import { Link } from "react-router-dom";

export interface SidebarLink {
  name: string;
  path: string;
  icon: ReactElement; // This will accept any React element, including Lucide icons
}
interface SidebarProps {
  logo?: React.ReactNode;
  links: SidebarLink[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const Sidebar = ({
  logo,
  links,
  collapsed = false,
  onToggleCollapse,
  className = "",
}: SidebarProps) => {
  console.log(links);
  const [activeLink, setActiveLink] = useState(links[0]?.path || "");
  return (
    <div
      className={`
        flex flex-col h-screen bg-blibli-900 text-white transition-all duration-300 
        ${collapsed ? "w-16" : "w-64"}
        ${className}
      `}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-blibli-700">
        {!collapsed && (
          <div className="flex items-center">
            {logo || <span className="text-xl font-bold">Dashboard</span>}
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-md hover:bg-blibli-800"
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      </div>
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          {links.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`
                  flex items-center px-4 py-3 transition-colors
                  ${
                    activeLink === link.path
                      ? "bg-blibli-700"
                      : "hover:bg-blibli-800"
                  }
                `}
                onClick={() => {
                  setActiveLink(link.path);
                }}
              >
                <span className="flex items-center justify-center">
                  {link.icon}
                </span>
                {!collapsed && <span className="ml-3">{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Footer */}
      <div className="p-4 border-t border-blibli-700">
        {!collapsed && (
          <div className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} Your Company
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
