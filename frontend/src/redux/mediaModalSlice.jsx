import { createSlice } from '@reduxjs/toolkit';

const mediaModalSlice = createSlice({
  name: 'mediaModal',
  initialState: {
    isOpen: false,
    mediaId: null,
    mediaType: null,
    btnHide: false,
  },
  reducers: {
    openModal(state, action) {
      state.isOpen = true;
      state.mediaId = action.payload.mediaId;
      state.mediaType = action.payload.mediaType;
    },
    closeModal(state) {
      state.isOpen = false;
      state.mediaId = null;
      state.mediaType = null;
    },
    enableBtnHide(state) {
      state.btnHide = true;
    },
    disableBtnHide(state) {
      state.btnHide = false;
    },
  },
});

export const { openModal, closeModal, enableBtnHide, disableBtnHide } = mediaModalSlice.actions;
export default mediaModalSlice.reducer;
