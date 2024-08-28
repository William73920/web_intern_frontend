import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notes: [],
  selectedNote: null,
  newNotesMode: true,
  isMobile: false,
  hasMore: true,
  page: 1,
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },

    setSelectedNote: (state, action) => {
      state.selectedNote = action.payload;
    },
    setNewNotesMode: (state, action) => {
      state.newNotesMode = action.payload;
    },
  },
});

export const {
  setNotes,
  setSelectedNote,
  setNewNotesMode,
  setPage,
  setHasMore,
} = notesSlice.actions;
export default notesSlice.reducer;
