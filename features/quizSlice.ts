import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizState {
    questions: { id: number; question: string; options: string[]; answer: string }[];
}

const initialState: QuizState = {
    questions: [],
};

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        setQuestions: (state, action: PayloadAction<QuizState["questions"]>) => {
            state.questions = action.payload;
        },
    },
});

export const { setQuestions } = quizSlice.actions;
export default quizSlice.reducer;
