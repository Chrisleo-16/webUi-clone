// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { NotificationModel } from "@/helpers/interfaces/NotificationModel";

// interface NotificationsState {
//   otherNotifications: NotificationModel[];
// }

// const initialState: NotificationsState = {
//   otherNotifications: [],
// };

// const otherNotificationsSlice = createSlice({
//   name: "otherNotifications",
//   initialState,
//   reducers: {
//     addOtherNotification: (state, action: PayloadAction<NotificationModel>) => {
//       if (!state.otherNotifications.some((n) => n.id === action.payload.id)) {
//         state.otherNotifications.unshift(action.payload);
//       }
//     },
//     addOtherNotifications: (state, action: PayloadAction<NotificationModel[]>) => {
//       const uniqueNotifications = action.payload.filter(
//         (n) => !state.otherNotifications.some((existing) => existing.id === n.id)
//       );
//       state.otherNotifications.unshift(...uniqueNotifications);
//     },
//     markOtherNotificationAsRead: (state, action: PayloadAction<number>) => {
//       const notification = state.otherNotifications.find((n) => n.id === action.payload);
//       if (notification) notification.read = true;
//     },
//     markAllOtherNotificationsAsRead: (state) => {
//       state.otherNotifications.forEach((n) => (n.read = true));
//     },
//     clearOtherNotifications: (state) => {
//       state.otherNotifications = [];
//     },
//   },
// });

// export const {
//   addOtherNotification,
//   addOtherNotifications,
//   markOtherNotificationAsRead,
//   markAllOtherNotificationsAsRead,
//   clearOtherNotifications,
// } = otherNotificationsSlice.actions;

// export default otherNotificationsSlice.reducer;
