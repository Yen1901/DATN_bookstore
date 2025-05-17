import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  reviews: [],
  isLoading: false,
  reviewDetails: null,
};

export const getAllReviews = createAsyncThunk(
  "/reviews/getAllReviews",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/reviews/get`
    );
    return response.data;
  }
);

export const deleteReviewByID = createAsyncThunk(
  "/reviews/deleteReviewByID",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/reviews/delete/${id}`
    );

    return result?.data;
  }
);

export const toggleReviewVisibility = createAsyncThunk(
  "/reviews/toggleReviewVisibility",
  async (id) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/reviews/put/${id}`
    );
    return result?.data?.data; 
  }
);


const adminReviewsSlice = createSlice({
  name: "adminReviewsSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getAllReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })
      .addCase(toggleReviewVisibility.fulfilled, (state, action) => {
      const updatedReview = action.payload;
      const index = state.reviews.findIndex(
        (review) => review._id === updatedReview._id
      );
      if (index !== -1) {
        state.reviews[index] = updatedReview;
      }
    });
  },
});

export default adminReviewsSlice.reducer;
