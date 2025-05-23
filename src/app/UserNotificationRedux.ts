// import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { NotificationModel } from "@/helpers/interfaces/NotificationModel";

// // Define the state interface for notifications
// interface NotificationsState {
//   notifications: NotificationModel[];
// }

// // Initial state for notifications
// const initialNotificationsState: NotificationsState = {
//   notifications: [],
// };

// // Generic function to create a notification slice
// const createNotificationSlice = (name: string) => {
//   return createSlice({
//     name,
//     initialState: initialNotificationsState,
//     reducers: {
//       addNotification: (state, action: PayloadAction<NotificationModel>) => {
//         if (!state.notifications.some((n) => n.id === action.payload.id)) {
//           state.notifications.unshift(action.payload);
//         }
//       },
//       addNotifications: (state, action: PayloadAction<NotificationModel[]>) => {
//         const uniqueNotifications = action.payload.filter(
//           (n) => !state.notifications.some((existing) => existing.id === n.id)
//         );
//         state.notifications.unshift(...uniqueNotifications);
//       },
//       markNotificationAsRead: (state, action: PayloadAction<number>) => {
//         const notification = state.notifications.find((n) => n.id === action.payload);
//         if (notification) notification.read = true;
//       },
//       markAllNotificationsAsRead: (state) => {
//         state.notifications.forEach((n) => (n.read = true));
//       },
//       clearNotifications: (state) => {
//         state.notifications = [];
//       },
//     },
//   });
// };

// // Create slices for user and admin notifications
// const userNotificationsSlice = createNotificationSlice("userNotifications");
// const adminNotificationsSlice = createNotificationSlice("adminNotifications");

// // Export actions for user notifications
// export const {
//   addNotification: addUserNotification,
//   addNotifications: addUserNotifications,
//   markNotificationAsRead: markUserNotificationAsRead,
//   markAllNotificationsAsRead: markAllUserNotificationsAsRead,
//   clearNotifications: clearUserNotifications,
// } = userNotificationsSlice.actions;

// // Export actions for admin notifications
// export const {
//   addNotification: addAdminNotification,
//   addNotifications: addAdminNotifications,
//   markNotificationAsRead: markAdminNotificationAsRead,
//   markAllNotificationsAsRead: markAllAdminNotificationsAsRead,
//   clearNotifications: clearAdminNotifications,
// } = adminNotificationsSlice.actions;

// // Export reducers
// export const userNotificationsReducer = userNotificationsSlice.reducer;
// export const adminNotificationsReducer = adminNotificationsSlice.reducer;

// // Configure store
// export const store = configureStore({
//   reducer: {
//     userNotifications: userNotificationsReducer,
//     adminNotifications: adminNotificationsReducer,
//   },
// });

// // Export types for use in the app
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;