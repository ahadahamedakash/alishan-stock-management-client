import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useThemeContext } from "../theme/ThemeProvider";
import { useNavigate, useLocation } from "react-router-dom";

import { useSidebar } from "@/contexts/SidebarContext";

import {
  X,
  Menu,
  Users,
  Receipt,
  FileText,
  BarChart3,
  HandCoins,
  ShoppingBag,
  ChevronLeft,
  UserRoundCog,
  ChevronRight,
  PackageSearch,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Analytics",
    icon: <BarChart3 className="h-5 w-5" aria-hidden="true" />,
    path: "/",
    role: ["super_admin", "admin"],
  },
  {
    label: "Products",
    icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
    path: "/products",
    role: ["super_admin", "admin", "accountant", "stock_manager"],
  },
  {
    label: "Customers",
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
    path: "/customers",
    role: ["super_admin", "admin", "accountant"],
  },
  {
    label: "Invoices",
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
    path: "/invoices",
    role: ["super_admin", "admin", "accountant"],
  },
  {
    label: "Collections",
    icon: <HandCoins className="h-5 w-5" aria-hidden="true" />,
    path: "/collections",
    role: ["super_admin", "admin", "accountant"],
  },
  {
    label: "Stocks",
    icon: <PackageSearch className="h-5 w-5" aria-hidden="true" />,
    path: "/stocks",
    role: ["super_admin", "admin", "stock_manager"],
  },
  {
    label: "Expenses",
    icon: <Receipt className="h-5 w-5" aria-hidden="true" />,
    path: "/expenses",
    role: ["super_admin", "admin", "accountant"],
  },
  {
    label: "Users",
    icon: <Users className="h-5 w-5" aria-hidden="true" />,
    path: "/users",
    role: ["super_admin", "admin"],
  },
  {
    label: "Employees",
    icon: <UserRoundCheck className="h-5 w-5" aria-hidden="true" />,
    path: "/employees",
    role: ["super_admin", "admin", "accountant"],
  },
  {
    label: "Profile",
    icon: <UserRoundCog className="h-5 w-5" aria-hidden="true" />,
    path: "/profile",
    role: ["super_admin", "admin", "accountant", "stock_manager"],
  },
];

export function Sidebar({ userData }) {
  const navigate = useNavigate();

  const location = useLocation();

  const { primaryColor } = useThemeContext();

  const { isCollapsed, setIsCollapsed } = useSidebar();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  // USER ROLE
  const userRole = userData?.role;

  const accessibleNavItems = navItems.filter((item) =>
    item?.role?.includes(userRole)
  );

  useEffect(() => {
    if (userRole) {
      setMounted(true);
    }
  }, [userRole]);

  if (!mounted) return null;

  return (
    <>
      {/* {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )} */}

      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-expanded={isMobileOpen}
          aria-label="Toggle navigation menu"
          aria-controls="sidebar-navigation"
          className="bg-background/50 backdrop-blur-lg border border-border/50"
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        id="sidebar-navigation"
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out",
          "bg-black/10 dark:bg-white/5 backdrop-blur-lg",
          "border-r border-neutral-200/10 dark:border-neutral-800/20",
          isCollapsed ? "w-28" : "w-64",
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full relative">
          {/* Logo */}
          <div className={cn("p-6", isCollapsed && "p-6")}>
            <div className="flex items-center gap-2">
              <img src="/logo.png" className="w-12" alt="Alishan Logo" />
              {!isCollapsed && (
                <h3 className="text-xl font-bold text-[#B38A2D]">Alishan</h3>
              )}
            </div>
          </div>

          {/* Collapse Toggle Button */}
          <Button
            variant="collapse"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={isCollapsed}
            className="absolute -right-5 top-12 rounded-full hidden md:block"
          >
            {isCollapsed ? (
              <ChevronRight
                className="h-8 w-8"
                style={{ color: primaryColor }}
                aria-hidden="true"
              />
            ) : (
              <ChevronLeft
                className="h-8 w-8"
                style={{ color: primaryColor }}
                aria-hidden="true"
              />
            )}
          </Button>

          {/* Navigation */}
          <nav aria-label="Primary navigation" className="flex-1 py-4">
            <ul role="list" className="space-y-1">
              {accessibleNavItems.map((item) => (
                <li key={item.label} role="listitem" className="">
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileOpen(false);
                    }}
                    aria-current={location?.pathname === item.path ? "page" : undefined}
                    className={cn(
                      "flex items-center w-full py-3 group",
                      "transition-all duration-200 ease-in-out",
                      isCollapsed
                        ? "justify-center px-4"
                        : "justify-start px-6",
                      location?.pathname === item.path
                        ? "bg-[#B38A2D]/20 text-[#E1BE5D]"
                        : "hover:bg-[#B38A2D]/10 text-foreground/80 hover:text-foreground"
                    )}
                    style={{
                      backgroundColor:
                        location?.pathname && location?.pathname === item.path
                          ? `${primaryColor}20`
                          : "transparent",
                      color:
                        location?.pathname && location?.pathname === item.path
                          ? primaryColor
                          : "",
                    }}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="py-4 border-t border-neutral-200/10 dark:border-neutral-800/20">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <div className="h-12 w-12 flex justify-center items-center p-2 rounded-full bg-neutral-300 dark:bg-neutral-800 flex-shrink-0">
                <img src="/icon.png" className="w-12" />
              </div>
              {!isCollapsed && userData !== null && (
                <div>
                  <p className="font-medium text-foreground">
                    {userData?.name}
                  </p>
                  <p className="text-xs">{userData?.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
