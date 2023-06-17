import { RootState } from '../../store';

export const banksList = (rootState: RootState) => rootState.banks.bank.list;

export const addBank = (rootState: RootState) =>
  rootState.banks.bank.addBankInfo;

export const editBank = (rootState: RootState) =>
  rootState.banks.bank.editBankInfo;
