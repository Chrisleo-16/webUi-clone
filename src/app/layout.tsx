import { Metadata } from "next";

import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";
import xmobcolors from "./styles/xmobcolors";
import { NextAuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "./ToastProvider";
import ReduxProvider from "./providers/ReduxProvider";
import { CssBaseline } from "@mui/material";


export const metadata: Metadata = {
  title: "XMOBIT",
  description: "EASY, FAST AND SECURE",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={` antialiased bg-[${xmobcolors.light}]`}
        suppressHydrationWarning={true}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastProvider>
              <ReduxProvider>
                  <NextAuthProvider>{children}</NextAuthProvider>
              </ReduxProvider>
            </ToastProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
