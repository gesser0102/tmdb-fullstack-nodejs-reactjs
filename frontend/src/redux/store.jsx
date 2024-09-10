import { configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./appStateSlice";
import loginModalSlice from "./loginModalSlice";
import globalLoadingSlice from "./globalLoadingSlice"; // Verifique se está importado corretamente
import userSlice from "./userSlice";
import mediaModalSlice from "./mediaModalSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    authModal: loginModalSlice,
    globalLoading: globalLoadingSlice, // Correção feita aqui
    appState: appStateSlice,
    mediaModal: mediaModalSlice
  }
});