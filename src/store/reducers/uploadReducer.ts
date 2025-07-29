import {
  UPLOAD_BOOK,
  UPLOAD_PROGRESS,
  UPLOAD_COMPLETE,
  UPLOAD_ERROR
} from '../actions/uploadActions';

interface UploadState {
  loading: boolean;
  progress: number;
  error: string | null;
  uploadedBooks: any[];
}

const initialState: UploadState = {
  loading: false,
  progress: 0,
  error: null,
  uploadedBooks: []
};

export default function uploadReducer(state = initialState, action: any) {
  switch (action.type) {
    case UPLOAD_BOOK:
      return {
        ...state,
        loading: true,
        progress: 0,
        error: null
      };
    case UPLOAD_PROGRESS:
      return {
        ...state,
        progress: action.payload
      };
    case UPLOAD_COMPLETE:
      return {
        ...state,
        loading: false,
        progress: 100,
        uploadedBooks: [...state.uploadedBooks, action.payload]
      };
    case UPLOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}