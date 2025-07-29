import { Dispatch } from 'redux';
import { uploadBookAPI } from '../../utils/request/uploadAPI';

export const UPLOAD_BOOK = 'UPLOAD_BOOK';
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_COMPLETE = 'UPLOAD_COMPLETE';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';

export const uploadBook = (file: File, progressCallback?: (progress: number) => void) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: UPLOAD_BOOK });
      
      const onUploadProgress = (progressEvent: ProgressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        dispatch({ type: UPLOAD_PROGRESS, payload: progress });
        if (progressCallback) progressCallback(progress);
      };
      
      const response = await uploadBookAPI(file, onUploadProgress);
      
      dispatch({
        type: UPLOAD_COMPLETE,
        payload: response.data
      });
      
      return response.data;
    } catch (error) {
      dispatch({
        type: UPLOAD_ERROR,
        payload: error.message
      });
      throw error;
    }
  };
};