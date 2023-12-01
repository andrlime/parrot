import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUploadedFile } from '@parrot/interfaces';

interface MainState {
  fileHistory: IUploadedFile[];
  mostRecentFile?: IUploadedFile;
}

const initialState: MainState = {
  fileHistory: [],
  mostRecentFile: undefined
};

export const mainSlice = createSlice({
  name: '_EVERYTHING',
  initialState,
  reducers: {
    upload_new_file: (state, action: PayloadAction<IUploadedFile>) => {
      if(!state.fileHistory) {
        state.fileHistory = [action.payload];
      } else {
        state.fileHistory.push(action.payload);
      }
      state.mostRecentFile = action.payload;
    }
  }
})

export const { upload_new_file } = mainSlice.actions

export default mainSlice.reducer
