import { configureStore } from "@reduxjs/toolkit";
import { quizApi } from "../lib/api";
import quizReducer from "../features/quizSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
    reducer: {
        quiz: quizReducer,
        auth: authReducer,
        [quizApi.reducerPath]: quizApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(quizApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
