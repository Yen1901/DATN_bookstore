import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  isLoading: false,
  error: null,
  userDetails: null,
};

export const getAllUsers = createAsyncThunk("/user/getAllUsers", async () => {
  const response = await axios.get(`http://localhost:5000/api/admin/users/get`);
  return response.data;
});

export const getUserByID = createAsyncThunk("/user/getUserByID", async (id) => {
  const response = await axios.get(
    `http://localhost:5000/api/admin/users/get/${id}`
  );
  return response.data;
});

export const updateUserStatus = createAsyncThunk(
  "/user/updateUserStatus",
  async ({ id, role, isActive }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/users/update/${id}`,
      {
        role,
        isActive,
      }
    );
    return response.data;
  }
);

const adminUserSlice = createSlice({
  name: "adminUserSlice",
  initialState,
  reducers: {
    resetUserDetails: (state) => {
      console.log("resetUserDetails");
      state.userDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(getUserByID.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserByID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.data;
      })
      .addCase(getUserByID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(updateUserStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUsers = state.users.map((user) =>
          user._id === action.payload.data._id ? action.payload.data : user
        );
        state.users = updatedUsers;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetUserDetails } = adminUserSlice.actions;
export default adminUserSlice.reducer;
