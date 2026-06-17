import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

const MOBILE_BREAKPOINT = 768;

export default function DashboardLayout() {
  const { isCollapsed, isMobileMenuOpen } = useSidebar();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  const currentUser = useSelector(useCurrentUser)?.user;

  // Handle resize to detect mobile or desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isCollapsed ? "w-[64px]" : "w-[240px]";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed z-30 h-full transition-all duration-300",
          isMobile
            ? isMobileMenuOpen
              ? "left-0 w-[240px]"
              : "-left-full w-[240px]"
            : sidebarWidth
        )}
      >
        <Sidebar userData={currentUser} />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col transition-all duration-300",
          "w-full h-full",
          isMobile ? "ml-0" : isCollapsed ? "ml-[64px]" : "ml-[240px]"
        )}
      >
        {/* Topbar */}
        <Topbar userData={currentUser} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-10 pt-24 w-full">
          <div className="max-w-7xl mx-auto mb-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// import { Outlet } from "react-router";
// import { Topbar } from "@/components/shared/Topbar";
// import { Sidebar } from "@/components/shared/Sidebar";
// import { useSidebar } from "@/contexts/SidebarContext";

// export default function DashboardLayout() {
//   const { isCollapsed } = useSidebar();

//   return (
//     <div className="min-h-screen flex">
//       {/* Sidebar */}
//       <Sidebar />

//       <div className="flex-1">
//         {/* Topbar */}
//         <Topbar />

//         {/* Main content */}
//         <main
//           className={`pt-16 transition-all duration-300 ${
//             isCollapsed ? "lg:pl-28" : "lg:pl-64"
//           }`}
//         >
//           <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
