"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AccountBalanceWallet,
  AdminPanelSettings,
  CurrencyExchange,
  Help,
  Home,
  LocalMall,
  Logout,
  MonetizationOn,
  NotificationImportant,
  SendAndArchiveOutlined,
  Settings,
  ShoppingBasketTwoTone,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import xmobcolors from "../styles/xmobcolors";
import { Badge } from "@mui/material";
import MobitCard from "@/components/cards/xmobcard";
import XmobImage from "@/components/images/xmobImage";
import LetterAvatar from "@/components/images/LetterAvatar";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobitSidebar from "@/components/menus/xmobitSideMenu";
import XmobInput from "@/components/inputs/xmobitInput";
import XmobText from "@/components/text/xmobText";
import TokenService from "@/helpers/Token/token.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationMenu from "@/components/ui/notifications/NotificationMenu";
import UserNotificationMenu from "@/components/ui/notifications/userNotification";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    name: "Dashboard",
    icon: <Home />,
    path: "/dashboard",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "My Wallets & accounts",
    icon: <AccountBalanceWallet />,
    path: "/wallets-and-accounts",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "Send Crypto",
    icon: <SendAndArchiveOutlined />,
    path: "/send",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "Market Place",
    icon: <LocalMall />,
    path: "/buy-sell",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "Create Order",
    icon: <MonetizationOn />,
    path: "/create-order",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "Trades and Orders",
    icon: <ShoppingBasketTwoTone />,
    path: "/orders",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "Exchange Portal",
    icon: <CurrencyExchange />,
    path: "/exchanges",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "Settings",
    icon: <Settings />,
    path: "/settings",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "Help",
    icon: <Help />,
    path: "/help",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "Admin Panel",
    icon: <AdminPanelSettings />,
    path: "/admin/dashboard",
    color: xmobcolors.primary,
    activeColor: xmobcolors.secondary,
  },
  {
    name: "Logout",
    icon: <Logout />,
    path: "/logout",
    color: "#ff4d4d",
    activeColor: xmobcolors.secondary,
  },
];

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [greeting, setGreeting] = useState<string>("");
  const [profileImageError, setProfileImageError] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");

  const router = useRouter();

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
    setUserRole(decodedToken?.role || "");
    generateGreeting();
  };

  useEffect(() => {
    extractDetails();

    const intervalId = setInterval(generateGreeting, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  const handleImageError = () => {
    setProfileImageError(true);
  };

  const checkAuth = async () => {
    try {
      const token = await TokenService.getValidToken();
      if (token === null) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };

  useEffect(() => {
    checkAuth();

    const tokenCheckInterval = setInterval(async () => {
      const isExpired = await TokenService.isTokenExpired();
      if (isExpired) {
        console.log("Token expired, logging out...");
        await TokenService.removeToken();
        router.push("/login");
      }
    }, 30000);

    return () => clearInterval(tokenCheckInterval);
  }, [router]);

  const handleLogout = async () => {
    await TokenService.removeToken();
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isMenuItemActive = (itemPath: string) => {
    if (itemPath === "/dashboard") {
      return pathname === itemPath;
    }
    return pathname?.startsWith(itemPath) && itemPath !== "/";
  };

  const menuItemsWithHandlers = menuItems
    .filter((item) => {
      if (item.name === "Admin Panel") {
        return (
          userRole.toLowerCase() === "admin" ||
          userRole.toLowerCase() === "super_admin"
        );
      }
      return true;
    })
    .map((item) => {
      const isActive = isMenuItemActive(item.path);

      if (item.name === "Logout") {
        return {
          ...item,
          onClick: handleLogout,
          style: {
            backgroundColor: isActive ? "rgba(0, 0, 0, 0.04)" : "transparent",
            color: item.color,
            padding: "10px 15px",
            borderRadius: "4px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          },
        };
      }

      return {
        ...item,
        style: {
          // backgroundColor: isActive ? "rgba(0, 0, 0, 0.04)" : "transparent",
          // color: isActive ? item.activeColor : "black",
          fontWeight: isActive ? "bold" : "normal",
          padding: "10px 15px",
          borderRadius: "4px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        },
      };
    });

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
  return (
    <div className="min-h-screen w-full">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`transition-all duration-300 ${
            isSidebarOpen ? "md:ml-64" : ""
          }`}
        >
          <div className="px-4 pt-2 pb-4 border-b backdrop-blur-xl">
            {/* <MobitCard isShadow={true} className="bg-red-800"> */}
            <Xmoblayout layoutType="flex-row" isFlexEndToEnd={true}>
              <Xmoblayout layoutType="flex-row" className="pt-0">
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
                  {/* <Badge badgeContent={4} color="primary">
                    <NotificationImportant color="action" />
                  </Badge> */}
                  <UserNotificationMenu />

                  {/* User profile with popover directly integrated */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer">
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
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <p className="font-medium">
                            {userDetails?.userName || "User"}
                          </p>
                          <p className="text-gray-500">
                            {userDetails?.userEmail || "No email available"}
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </Xmoblayout>
              </div>
            </Xmoblayout>
            {/* </MobitCard> */}
          </div>
        </div>
      </div>

      {/* Main Content Area with top padding for fixed navbar */}
      <div className="pt-20">
        {" "}
        {/* Add padding-top to account for fixed navbar */}
        <div className="flex relative">
          {/* Desktop Sidebar: collapsible */}
          <div
            className="hidden md:block transition-all duration-300"
            style={{ width: isSidebarOpen ? "16rem" : "0" }}
          >
            {isSidebarOpen && (
              <XmobitSidebar
                menuItems={menuItemsWithHandlers}
                isOpen={true}
                onClose={toggleSidebar}
                noScroll={true}
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
                  menuItems={menuItemsWithHandlers}
                  isOpen={true}
                  onClose={toggleSidebar}
                  noScroll={true}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-grow p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
