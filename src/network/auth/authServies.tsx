import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { ErrorType, LoginRequestType, LoginType, AuthType } from '../../types';
import { getApp } from 'firebase/app';

export const register = (data: AuthType) => {
  return new Promise<boolean | ErrorType>((resolve) => {
    const auth = getAuth(getApp());
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        resolve({
          errorCode: error.code,
          message: error.message,
        } as ErrorType);
      });
  });
};

export const login = (data: LoginRequestType) => {
  return new Promise<LoginType | ErrorType>((resolve) => {
    const auth = getAuth(getApp());
    signInWithEmailAndPassword(auth, data.email, data.password).then(
      (userCredential) => {
        userCredential.user
          ?.getIdToken()
          .then((token) => {
            if (token) {
              resolve({
                token,
              } as LoginType);
            } else {
              resolve({
                errorCode: 'TOKEN_NOT_FOUND',
                message: 'Token not found.',
              } as ErrorType);
            }
          })
          .catch((e) => {
            resolve({
              errorCode: 'TOKEN_NOT_FOUND',
              message: 'Token not found.',
            } as ErrorType);
          })
          .catch((error) => {
            resolve({
              errorCode: error.code,
              message: error.message,
            } as ErrorType);
          });
      }
    );
  });
};

export const logout = () => {
  return new Promise<void | ErrorType>((resolve) => {
    const auth = getAuth(getApp());
    signOut(auth)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        resolve({
          errorCode: error.code,
          message: error.message,
        } as ErrorType);
      });
  });
};
