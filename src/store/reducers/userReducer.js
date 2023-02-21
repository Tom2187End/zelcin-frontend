import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: window.localStorage.getItem("user") ? 
            JSON.parse(window.localStorage.getItem("user")) : {
            firstName: "",
            lastName: "",
            email: ""
        },
        token: window.localStorage.getItem("token") ? window.localStorage.getItem("token") : "",
        loading: false
    },
    reducers: {
        createUser(state, action) {
            window.localStorage.setItem("user", JSON.stringify(action.payload.user));
            window.localStorage.setItem("token", action.payload.token);
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        updateUser(state, action) {
            
        },
        updateMembership(state, action) {
            let user = JSON.parse(window.localStorage.getItem("user"));
            user = {...user, membership: action.payload };
            window.localStorage.setItem("user", JSON.stringify(user));
            state.user= user;
        },
        deleteUser(state, action) {
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("token");
            state.user = {
                firstName: "",
                lastName: "",
                email: ""
            };
            state.token = "";
        },
        setLoading(state, action) {
            state.loading = action.payload;
        } 
    }
});

export const { createUser, updateUser, updateMembership, deleteUser, setLoading } = userSlice.actions;

export default userSlice.reducer;