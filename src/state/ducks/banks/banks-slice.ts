import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankType } from '../../../types/banks';
import { ErrorType } from '../../../types/errors';
import { isSPError } from '../../../utils/errors';
import {
  fetchBanks,
  addBank,
  fetchBankDetails,
  updateBankDetails,
} from './actions';
import { config } from '../../../constants';

const FIXED_ROWS_PER_PAGE = config.TABLE_ROW_PER_PAGE;
const FIRST_PAGE_NUMBER = 0;

interface UsersState {
  bank: {
    list: {
      banks: BankType[];
      isLoading: boolean;
      error: ErrorType | undefined;
      page: number;
      rowsPerPage: number;
      totalCount: number;
    };
    editBankInfo: {
      bank: BankType | undefined;
      modifiedBankObject: BankType | undefined;
      isUpdating: boolean;
      errorWhileUpdating: ErrorType | undefined;
    };
    addBankInfo: {
      bankToBeAdded: BankType | undefined;
      isAdding: boolean;
      errorWhileAdding: ErrorType | undefined;
    };
  };
}

const initialState: UsersState = {
  bank: {
    list: {
      banks: [],
      isLoading: false,
      error: undefined,
      page: FIRST_PAGE_NUMBER,
      rowsPerPage: FIXED_ROWS_PER_PAGE,
      totalCount: 0,
    },
    editBankInfo: {
      bank: undefined,
      modifiedBankObject: undefined,
      isUpdating: false,
      errorWhileUpdating: undefined,
    },
    addBankInfo: {
      bankToBeAdded: undefined,
      isAdding: false,
      errorWhileAdding: undefined,
    },
  },
};

const banksSlice = createSlice({
  name: 'banks',
  initialState,
  reducers: {
    pageNumberChangedForBanksList(state, action: PayloadAction<number>) {
      state.bank.list.page = action.payload;
    },
    resetBanksList(state) {
      state.bank.list = initialState.bank.list;
    },
    resetBankEditInfo(state) {
      state.bank.editBankInfo = initialState.bank.editBankInfo;
    },
    updateBankObjectInList(
      state,
      action: PayloadAction<{
        bankId: string;
        newBankObject: BankType;
      }>
    ) {
      const bankObjectInList = state.bank.list.banks.find(
        (bankInList) => bankInList.bankId === action.payload.bankId
      );
      if (bankObjectInList) {
        bankObjectInList.bankName = action.payload.newBankObject.bankName;
        bankObjectInList.accountNumber =
          action.payload.newBankObject.accountNumber;
        bankObjectInList.ifscCode = action.payload.newBankObject.ifscCode;
        bankObjectInList.branchAddress =
          action.payload.newBankObject.branchAddress;
        bankObjectInList.contactNumber =
          action.payload.newBankObject.contactNumber;
      }
    },
    resetBankAddInfo(state) {
      state.bank.addBankInfo = initialState.bank.addBankInfo;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanks.pending, (state) => {
        state.bank.list.isLoading = true;
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        if (!isSPError(action.payload)) {
          state.bank.list.banks = action.payload.banks;
          state.bank.list.totalCount = action.payload.totalCount;
          state.bank.list.error = undefined;
        } else {
          state.bank.list.error = action.payload;
          state.bank.list.totalCount = 0;
          state.bank.list.page = FIRST_PAGE_NUMBER;
          state.bank.list.banks = [];
        }
        state.bank.list.isLoading = false;
      })
      .addCase(fetchBankDetails.pending, (state) => {
        state.bank.editBankInfo = initialState.bank.editBankInfo;
      })
      .addCase(fetchBankDetails.fulfilled, (state, action) => {
        if (!isSPError(action.payload)) {
          state.bank.editBankInfo = {
            bank: action.payload,
            modifiedBankObject: undefined,
            isUpdating: false,
            errorWhileUpdating: undefined,
          };
        } else {
          state.bank.editBankInfo = initialState.bank.editBankInfo;
        }
      })
      .addCase(addBank.pending, (state, action) => {
        state.bank.addBankInfo = {
          ...state.bank.addBankInfo!,
          isAdding: true,
          bankToBeAdded: action.meta.arg,
        };
      })
      .addCase(addBank.fulfilled, (state, action) => {
        if (!isSPError(action.payload)) {
          state.bank.addBankInfo = {
            ...state.bank.addBankInfo!,
            isAdding: false,
          };
        } else {
          state.bank.addBankInfo = {
            ...state.bank.addBankInfo!,
            isAdding: false,
            errorWhileAdding: action.payload,
          };
        }
      })
      .addCase(updateBankDetails.pending, (state, action) => {
        state.bank.editBankInfo = {
          ...state.bank.editBankInfo!,
          isUpdating: true,
          modifiedBankObject: action.meta.arg.newBankObject,
        };
      })
      .addCase(updateBankDetails.fulfilled, (state, action) => {
        if (!isSPError(action.payload)) {
          state.bank.editBankInfo = {
            ...state.bank.editBankInfo!,
            isUpdating: false,
          };
        } else {
          state.bank.editBankInfo = {
            ...state.bank.editBankInfo!,
            isUpdating: false,
            errorWhileUpdating: action.payload,
          };
        }
      });
  },
});

export const {
  pageNumberChangedForBanksList,
  resetBanksList,
  resetBankEditInfo,
  updateBankObjectInList,
  resetBankAddInfo,
} = banksSlice.actions;
export default banksSlice.reducer;
