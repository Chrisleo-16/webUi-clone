"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import XmobText from "../text/xmobText";
import XmobImage from "../images/xmobImage";
import xmobcolors from "@/app/styles/xmobcolors";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  onClick?: () => void;
}

interface XmobitSidebarProps {
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  noScroll?: boolean;
}

const XmobitSidebar: React.FC<XmobitSidebarProps> = ({
  menuItems,
  isOpen = true,
  onClose,
  noScroll = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (menuItem: MenuItem) => {
    if (menuItem.onClick) {
      menuItem.onClick();
    } else {
      router.push(menuItem.path);
    }
  };
  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={`h-full bg-white border-r ${isOpen ? "block" : "hidden"}`}
      style={{
        width: "16rem",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: noScroll ? "hidden" : "auto",
        maxHeight: "100vh",
        zIndex: 50,
      }}
    >
      <div className="px-4 pt-4 border-gray-200 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center  flex-grow">
            <XmobImage
              src="/xmobit.png"
              alt="logo"
              width="100px"
              height="50px"
              circular={true}
            />
          </div>
          <button
            onClick={onClose}
            className="p-1 md:hidden"
            style={{ display: "none" }}
          >
            <CloseIcon />
            <style jsx>{`
              @media (max-width: 800px) {
                button {
                  display: block !important;
                }
              }
            `}</style>
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-76px)] flex flex-col">
        <nav className="mt-3 flex-grow">
          <ul className="flex flex-col h-full justify-start">
            {menuItems.map((menuItem, index) => (
              <li key={index} className="py-1">
                <button
                  className={`border-l-[5px] border-transparent w-full text-left px-4 py-2 flex items-center 
                    ${pathname === menuItem.path ? "border-[#00A857] text-[#00A857] bg-green-50" : ""}`}
                  onClick={() => handleNavigation(menuItem)}
                >
                  <span className="mr-3">{menuItem.icon}</span>
                  <XmobText>{menuItem.name}</XmobText>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default XmobitSidebar;
