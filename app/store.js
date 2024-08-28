import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./redux/notesSlice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});
