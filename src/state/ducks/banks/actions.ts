import {
  getBanks as getBanksService,
  getBankDetails as getBankDetailsService,
  addBank as addBankService,
  updateBank as updateBankService,
  deleteBank as deleteBankService,
} from '../../../network/banks/banksServices';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { isSPError } from '../../../utils/errors';
import { banksOperations } from '../banks';
import {
  AddBankRequest,
  BankType,
  GetBanksResponse,
  UpdateBankRequest,
} from '../../../types/banks';
import { ErrorType } from '../../../types/errors';

const FETCH_BANKS = 'banks/fetchBanks';
const FETCH_BANK_DETAILS = 'banks/fetchBankDetails';
const ADD_BANK = 'banks/addBank';
const UPDATE_BANK_DETAILS = 'banks/updateBankDetails';
const DELETE_BANK = 'banks/deleteBank';

export const fetchBanks = createAsyncThunk<
  GetBanksResponse | ErrorType,
  { page: number; searchText?: string },
  { state: RootState }
>(FETCH_BANKS, async ({ page, searchText }, { getState }) => {
  const { rowsPerPage } = getState().banks.bank.list;

  const response = await getBanksService(page, rowsPerPage, searchText);
  return response;
});

export const fetchBankDetails = createAsyncThunk<
  BankType | ErrorType,
  string,
  { state: RootState }
>(FETCH_BANK_DETAILS, async (bankId) => {
  const response = await getBankDetailsService(bankId);
  return response;
});

export const addBank = createAsyncThunk<boolean | ErrorType | void, BankType>(
  ADD_BANK,
  async (bankToBeAdded) => {
    const request: AddBankRequest = {
      bankName: bankToBeAdded.bankName,
      accountNumber: bankToBeAdded.accountNumber,
      ifscCode: bankToBeAdded.ifscCode,
      branchAddress: bankToBeAdded.branchAddress,
      contactNumber: bankToBeAdded.contactNumber,
    };

    const response = await addBankService(request);
    return response;
  }
);

export const updateBankDetails = createAsyncThunk<
  boolean | ErrorType,
  {
    newBankObject: BankType;
    updateRequest: UpdateBankRequest;
  }
>(UPDATE_BANK_DETAILS, async ({ newBankObject, updateRequest }, thunkAPI) => {
  const response = await updateBankService(updateRequest);

  if (!isSPError(response) && response) {
    // Update the Bank object in the list without fetching from server.
    thunkAPI.dispatch(
      banksOperations.updateBankObjectInList({
        bankId: updateRequest.bankId,
        newBankObject,
      })
    );
  }
  return response;
});

export const deleteBank = createAsyncThunk<boolean | ErrorType, string>(
  DELETE_BANK,
  async (bankId) => {
    const response = await deleteBankService(bankId);

    return response;
  }
);
