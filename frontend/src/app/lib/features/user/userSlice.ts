import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  profilePictureSrc: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  username: "",
  profilePictureSrc: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ username: string; profilePictureSrc: string }>
    ) => {
      state.username = action.payload.username;
      state.profilePictureSrc = action.payload.profilePictureSrc;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.username = "";
      state.profilePictureSrc = "";
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
