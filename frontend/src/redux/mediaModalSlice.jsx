// store/mediaModalSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const mediaModalSlice = createSlice({
  name: 'mediaModal',
  initialState: {
    isOpen: false,
    mediaId: null,
    mediaType: null,
    modalEnabled: true,
    btnHide: false  // Adiciona a capacidade de desabilitar a abertura do modal
  },
  reducers: {
    openModal: (state, action) => {
      if (state.modalEnabled) {  // Só abre o modal se estiver habilitado
        state.isOpen = true;
        state.mediaId = action.payload.mediaId;
        state.mediaType = action.payload.mediaType;
      }
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.mediaId = null;
      state.mediaType = null;
    },
    toggleModalEnabled: (state, action) => {
      state.modalEnabled = action.payload;  // Altera a capacidade de abrir o modal
    },
    sharedFavorite: (state, action) => {
      state.btnHide = action.payload.mediaType;
    }
  }
});

export const { openModal, closeModal, toggleModalEnabled,sharedFavorite } = mediaModalSlice.actions;

export default mediaModalSlice.reducer;
