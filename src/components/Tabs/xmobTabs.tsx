import React, { useState } from "react";
import { Tabs, Tab, Box, useMediaQuery, useTheme } from "@mui/material";
import xmobcolors from "@/app/styles/xmobcolors";

interface TabItem {
  title: string;
  component: React.ReactNode;
}

interface XmobTabsProps {
  tabs: TabItem[];
  tabBgColor?: string;
  contentBgColor?: string;
  activeTabColor?: string;
  inactiveTabColor?: string;
  indicatorColor?: string;
  height?: string;
}

const XmobTabs: React.FC<XmobTabsProps> = ({
  tabs,
  tabBgColor = "transparent",
  contentBgColor = "#ffffff",
  activeTabColor = "#00A857 !important",
  inactiveTabColor = "#6c757d",
  indicatorColor = "#00A857",
  height = "50px",
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Box
        sx={{
          bgcolor: tabBgColor,
          height,
          display: "flex",
          alignItems: "center",
          overflowX: "auto", // Enables horizontal scrolling
          whiteSpace: "nowrap",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant={isSmallScreen ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          TabIndicatorProps={{
            style: { backgroundColor: indicatorColor, height: "3px" ,},
          }}
          sx={{
            minHeight: height,
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
              color: inactiveTabColor,
              minWidth: "max-content",
              padding: "6px 12px",
              flexShrink: 0,
            },
            "& .Mui-selected": {
              color: activeTabColor,
              fontWeight: "bold",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.title} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ p: 2, bgcolor: contentBgColor }}>
        {tabs[activeTab]?.component}
      </Box>
    </Box>
  );
};

export default XmobTabs;
