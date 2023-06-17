import { ErrorType } from '../types/errors';

export const isSPError = (data: any): data is ErrorType => {
  return !!data?.code;
};
