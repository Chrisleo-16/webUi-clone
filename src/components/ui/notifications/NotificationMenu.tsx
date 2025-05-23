"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Badge,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Select,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  NotificationImportant,
  MarkEmailRead,
  MarkEmailUnread,
  Delete,
} from "@mui/icons-material";
import BackedAdminSystemReport from "@/app/admin/system/reports/backed/backed_reports_service";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobText from "@/components/text/xmobText";
import HelpFormatter from "@/helpers/utils/xmobFomartUtil";
import AdminNotificationBackend from "@/app/admin/backed/AdminNotificationBacked";
import { useToast } from "@/app/ToastProvider";
import {
  clearAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
  RootState,
} from "@/app/store";

interface Notification {
  id: number;
  message: string;
  from: string;
  time: string;
  read: boolean;
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const NotificationMenu = () => {
  // Fetch admin notifications from the Redux store
  const notifications = useSelector(
    (state: RootState) => state.adminNotifications.notifications
  );
  const unreadCount = notifications.filter((n) => !n.read).length;
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("unread");

  // Fetch notifications periodically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await BackedAdminSystemReport.fetchAndDispatchNotifications();
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark the notification as read in the Redux store and backend
    dispatch(markAdminNotificationAsRead(notification.id));
    await markNotificationAsRead(notification);
    setSelectedNotification(notification);
  };

  const markNotificationAsRead = async (notification: Notification) => {
    const { success, message } =
      await AdminNotificationBackend.markNotificationAsRead(notification);
    if (!success) {
      showToast(message, "error");
    } else {
      // showToast(message, "success");
    }
  };

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read in the Redux store and backend
    markAllNotificationAsRead();
    dispatch(markAllAdminNotificationsAsRead());
  };

  const markAllNotificationAsRead = async () => {
    const { success, message } =
      await AdminNotificationBackend.markAllNotificationsAsRead();
    if (!success) {
      showToast(message, "error");
    } else {
      // showToast(message, "success");
    }
  };

  const handleClearNotifications = () => {
    // Clear all notifications in the Redux store
    dispatch(clearAdminNotifications());
    setAnchorEl(null);
  };

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "read") return notification.read;
    if (filter === "unread") return !notification.read;
    return true; // Show all notifications
  });

  return (
    <div>
      {/* Notification Badge */}
      <Badge
        badgeContent={unreadCount}
        color="primary"
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
        aria-label={`${unreadCount} unread notifications`}
      >
        <NotificationImportant color="action" />
      </Badge>

      {/* Notification Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        aria-labelledby="notification-menu"
        PaperProps={{ style: { width: 400 } }}
      >
        {/* Filter Dropdown */}
        <MenuItem disabled={notifications.length === 0}>
          <FormControl fullWidth>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "read" | "unread")
              }
              label="Filter"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        {/* Mark All as Read and Clear All Buttons */}
        <MenuItem disabled={notifications.length === 0}>
          <Button
            onClick={handleMarkAllAsRead}
            disabled={notifications.length === 0}
            startIcon={<MarkEmailRead />}
          >
            Mark All as Read
          </Button>
          <Button
            onClick={handleClearNotifications}
            color="error"
            disabled={notifications.length === 0}
            startIcon={<Delete />}
          >
            Clear All
          </Button>
        </MenuItem>

        <Divider />

        {/* Notification List */}
        {filteredNotifications.length === 0 ? (
          <MenuItem disabled>
            <XmobText variant="body2" color="textSecondary">
              No notifications
            </XmobText>
          </MenuItem>
        ) : (
          filteredNotifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              style={{ background: notification.read ? "#f0f0f0" : "#ffffff" }}
              aria-label={`Notification from ${notification.from}`}
            >
              <ListItemIcon>
                {notification.read ? (
                  <MarkEmailRead color="info" />
                ) : (
                  <MarkEmailUnread color="success" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Xmoblayout layoutType="flex-row" isFlexEndToEnd={true}>
                    <strong>{notification.from}:</strong>
                    <div>{HelpFormatter.formatDate(notification.time)}</div>
                  </Xmoblayout>
                }
                secondary={
                  <XmobText variant="body1">
                    {truncateText(notification.message, 30)}
                  </XmobText>
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>

      {/* Notification Details Dialog */}
      <Dialog
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
      >
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <>
              <XmobText variant="subtitle1" style={{ marginBottom: "8px" }}>
                <strong>From:</strong> {selectedNotification.from}
              </XmobText>
              <XmobText variant="subtitle1" style={{ marginBottom: "16px" }}>
                <strong>Time:</strong>{" "}
                {HelpFormatter.formatDate(selectedNotification.time)}
              </XmobText>
              <Divider sx={{ my: 2 }} />
              <XmobText variant="body1">
                {selectedNotification.message}
              </XmobText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectedNotification(null)}
            color="primary"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotificationMenu;
