import { create } from "zustand";

// Define the state type
interface GlobalState {
  data: Record<string, any>; // JSON object
  updateData: (newData: Record<string, any>) => void;
}

// Create Zustand store
export const useGlobalStore = create<GlobalState>((set) => ({
  data: { key: "Initial Value" }, // Initial state as JSON
  updateData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData }, // Merge new data into existing state
    })),
}));
