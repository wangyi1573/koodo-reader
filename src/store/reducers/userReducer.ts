import {
  LOGIN,
  LOGOUT,
  REGISTER
} from '../actions/userActions';

interface UserState {
  isAuthenticated: boolean;
  user: {
    id: number;
    username: string;
    role: string;
    token?: string;
  } | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null
};

export default function userReducer(state = initialState, action: any) {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
}