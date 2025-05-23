"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Folder,
  Group,
  Home,
  LibraryBooks,
  Logout,
  MonetizationOn,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import xmobcolors from "../styles/xmobcolors";
import MobitCard from "@/components/cards/xmobcard";
import XmobImage from "@/components/images/xmobImage";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobitSidebar from "@/components/menus/xmobitSideMenu";
import XmobInput from "@/components/inputs/xmobitInput";
import XmobText from "@/components/text/xmobText";
import NotificationMenu from "@/components/ui/notifications/NotificationMenu";
import { Coins, icons, User } from "lucide-react";
import TokenService from "@/helpers/Token/token.service";
import LetterAvatar from "@/components/images/LetterAvatar";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    name: "Dashboard",
    icon: <Home />,
    path: "/admin/dashboard",
    color: xmobcolors.primary,
  },
  {
    name: "Users",
    icon: <Group />,
    path: "/admin/users",
    color: xmobcolors.primary,
  },
  {
    name: "Tickets",
    icon: <Folder />,
    path: "/admin/tickets",
    color: xmobcolors.primary,
  },
  {
    name: "Payment Methods",
    icon: <MonetizationOn />,
    path: "/admin/payment-methods",
    color: xmobcolors.primary,
  },
  {
    name: "System Logs",
    icon: <LibraryBooks />,
    path: "/admin/system/reports",
    color: xmobcolors.primary,
  },
  {
    name: "Fees",
    icon: <Coins />,
    path: "/admin/trades/m/fees",
    color: xmobcolors.primary,
  },

  {
    name: "User Dashboard",
    icon: <User />,
    path: "/dashboard",
    color: xmobcolors.primary,
  },

  {
    name: "Logout",
    icon: <Logout />,
    path: "/logout",
    color: "#ff4d4d",
  },
];

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [greeting, setGreeting] = useState<string>("");
  const [profileImageError, setProfileImageError] = useState<boolean>(false);
  const generateGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "";

    if (hour >= 5 && hour < 12) {
      timeGreeting =
        "Good morning! Hope you are having a great start to your day.";
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon! Hope your day is going well.";
    } else if (hour >= 17 && hour < 22) {
      timeGreeting = "Good evening! Hope you had a productive day.";
    } else {
      timeGreeting =
        "Hello night owl! Hope you're doing well at this late hour.";
    }

    setGreeting(timeGreeting);
  };
  const extractDetails = async () => {
    const decodedToken = await TokenService.decodeToken();

    setUserDetails(decodedToken);
    const role = decodedToken?.role || "";
    setUserRole(role);

    const isAdmin =
      role.toLowerCase() === "admin" || role.toLowerCase() === "super_admin";
    setIsAuthorized(isAdmin);

    generateGreeting();
  };
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    extractDetails();
    checkAuth();

    const intervalId = setInterval(generateGreeting, 3600000);

    const tokenCheckInterval = setInterval(async () => {
      const isExpired = await TokenService.isTokenExpired();
      if (isExpired) {
        console.log("Token expired, logging out...");
        await TokenService.removeToken();
        router.push("/login");
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
      clearInterval(tokenCheckInterval);
    };
  }, [router]);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = await TokenService.getValidToken();
      if (token === null) {
        router.push("/login");
        return;
      }

      const decodedToken = await TokenService.decodeToken();
      const role = decodedToken?.role?.toLowerCase() || "";

      if (role !== "admin" && role !== "super_admin") {
        console.log("Unauthorized access attempt to admin area");
        router.push("/dashboard");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error("Error checking authentication:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await TokenService.removeToken();
    router.push("/login");
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      if (!urlString) return false;

      if (urlString.startsWith("http://") || urlString.startsWith("https://")) {
        new URL(urlString);
        return true;
      }

      if (urlString.startsWith("/")) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  };

  const processedMenuItems = menuItems.map((item) => {
    if (item.path === "/logout") {
      return {
        ...item,
        onClick: handleLogout,
      };
    }
    return item;
  });

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      ) : isAuthorized ? (
        <>
          <div
            className={`transition-all duration-300 ${
              isSidebarOpen ? "md:ml-64" : ""
            }`}
          >
            <MobitCard isShadow={true} className="pt-2">
              <Xmoblayout layoutType="flex-row" isFlexEndToEnd={true}>
                <Xmoblayout layoutType="flex-row">
                  {/* Toggle button with fancy icons */}
                  <div onClick={toggleSidebar} className="cursor-pointer">
                    <MenuIcon fontSize="large" />
                  </div>
                  {!isSidebarOpen && (
                    <XmobImage
                      src="/xmobit.png"
                      alt="logo"
                      width="100px"
                      height="30px"
                      circular={true}
                    />
                  )}

                  <XmobitSpacer width={2} />
                  <div>
                    <XmobText
                      variant="h6"
                      fontWeight="bold"
                      removeOnMobile={true}
                    >
                      {userDetails?.userName || "User"}
                    </XmobText>
                    <XmobText removeOnMobile={true}>{greeting}</XmobText>
                  </div>
                </Xmoblayout>

                <div>
                  <Xmoblayout layoutType="flex-row" isFlexEndToEnd={true}>
                    <XmobInput height={"2"} removeonMobile={true}></XmobInput>
                    <NotificationMenu />
                    {/* <Badge badgeContent={4} color="primary">
                      <NotificationImportant color="action" /> 
                    </Badge> */}
                    {userDetails &&
                    userDetails.profile_url &&
                    isValidUrl(userDetails.profile_url) &&
                    !profileImageError ? (
                      <XmobImage
                        src={userDetails.profile_url}
                        alt="user profile"
                        width="30px"
                        height="30px"
                        circular={true}
                      />
                    ) : (
                      <LetterAvatar
                        name={userDetails?.userName || "User"}
                        width="30px"
                        height="30px"
                        fontSize="14px"
                      />
                    )}
                  </Xmoblayout>
                </div>
              </Xmoblayout>
            </MobitCard>
          </div>

          <div className="flex relative">
            {/* Desktop Sidebar: collapsible */}
            <div
              className="hidden md:block transition-all duration-300"
              style={{ width: isSidebarOpen ? "16rem" : "0" }}
            >
              {isSidebarOpen && (
                <XmobitSidebar
                  menuItems={processedMenuItems}
                  isOpen={true}
                  onClose={toggleSidebar}
                />
              )}
            </div>

            {/* Mobile Sidebar: overlay */}
            {isSidebarOpen && (
              <div className="md:hidden">
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={toggleSidebar}
                />
                <div className="fixed top-0 left-0 w-64 h-full z-50">
                  <XmobitSidebar
                    menuItems={processedMenuItems}
                    isOpen={true}
                    onClose={toggleSidebar}
                  />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-grow p-4 md:p-6">{children}</div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p>You do not have permission to access this area.</p>
        </div>
      )}
    </div>
  );
}
