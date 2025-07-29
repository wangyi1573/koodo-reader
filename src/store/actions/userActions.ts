import { Dispatch } from 'redux';
import { DatabaseService } from '../../services/databaseService';
import { toast } from 'react-hot-toast';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';

import { SessionService } from '../../services/sessionService';

export const login = (username: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const isValid = await DatabaseService.verifyUser(username, password);
      
      if (!isValid) {
        throw new Error('用户名或密码错误');
      }
      
      const user = await DatabaseService.findUser(username);
      const session = await SessionService.createSession(user.id);
      
      dispatch({
        type: LOGIN,
        payload: {
          ...user.toJSON(),
          token: session.token
        }
      });
      
      return user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };
};

export const register = (username: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const existingUser = await DatabaseService.findUser(username);
      
      if (existingUser) {
        throw new Error('用户名已存在');
      }
      
      const user = await DatabaseService.createUser(username, password);
      
      dispatch({
        type: REGISTER,
        payload: user
      });
      
      return user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };
};

export const logout = (token?: string) => {
  return async (dispatch: Dispatch) => {
    if (token) {
      await SessionService.invalidateSession(token);
    }
    dispatch({ type: LOGOUT });
  };
};