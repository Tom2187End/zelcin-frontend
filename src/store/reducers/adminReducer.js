import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        sidebarShow: true,
        sidebarUnfoldable: false,
        loading: false
    },
    reducers: {
        setSidebar(state, action) {
            state.sidebarShow = action.payload
        },
        setSidebarUnfoldable(state, action) {
            state.sidebarUnfoldable = action.payload
        },
        setLoading(state, action) {
            state.loading = action.payload;
        } 
    }
});

export const { setSidebar, setSidebarUnfoldable } = userSlice.actions;

export default userSlice.reducer;