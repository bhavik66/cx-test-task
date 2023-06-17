import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  or,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getApp } from 'firebase/app';
import {
  AddBankRequest,
  BankType,
  GetBanksResponse,
  UpdateBankRequest,
} from '../../types';
import { ErrorType } from '../../types/errors';

export function getBanks(
  page: number = 0,
  size: number,
  searchText: string = ''
) {
  return new Promise<GetBanksResponse | ErrorType>((resolve) => {
    const db = getFirestore(getApp());
    const banksCollectionRef = collection(db, 'bank');
    let docQuery = query(banksCollectionRef);

    if (searchText) {
      docQuery = query(
        banksCollectionRef,
        where('searchField', 'array-contains', searchText.toLowerCase()),
        orderBy('bankName')
      );
    } else {
      docQuery = query(banksCollectionRef, orderBy('bankName'));
    }

    getDocs(docQuery)
      .then((querySnapshot) => {
        const banks: BankType[] = [];
        querySnapshot.forEach((doc) => {
          banks.push({
            bankId: doc.ref.id,
            ...doc.data(),
          } as BankType);
        });

        const totalCount = banks.length;

        if (size > 0) {
          const startIndex = page * size;
          const endIndex = startIndex + size;
          const paginatedBanks = banks.slice(startIndex, endIndex);

          resolve({
            totalCount,
            banks: paginatedBanks,
          });
        } else {
          resolve({
            totalCount,
            banks,
          });
        }
      })
      .catch((error) => {
        resolve({
          errorCode: error?.code,
          message: error?.message,
        } as ErrorType);
      });
  });
}

export function getBankDetails(bankId: string) {
  return new Promise<BankType | ErrorType>((resolve) => {
    const db = getFirestore(getApp());
    const bankRef = doc(db, 'bank', bankId);
    getDoc(bankRef)
      .then((bankSnapshot) => {
        if (bankSnapshot.exists()) {
          const bankDetails = bankSnapshot.data() as BankType;
          resolve({
            bankId: bankSnapshot.ref.id,
            ...bankDetails,
          });
        } else {
          resolve({
            errorCode: 'BANK_NOT_FOUND',
            message: 'Bank not found.',
          } as ErrorType);
        }
      })
      .catch((error) => {
        resolve({
          errorCode: error?.code,
          message: error?.message,
        } as ErrorType);
      });
  });
}

export function addBank(bankToBeAdded: AddBankRequest) {
  return new Promise<boolean | ErrorType>((resolve) => {
    const db = getFirestore(getApp());
    const bankCollectionRef = collection(db, 'bank');
    const dataWithSearchField = {
      ...bankToBeAdded,
      searchField: Object.values(bankToBeAdded).join(' ').toLowerCase(),
    };
    addDoc(bankCollectionRef, dataWithSearchField)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        resolve({
          errorCode: error?.code,
          message: error?.message,
        } as ErrorType);
      });
  });
}

export function updateBank(request: UpdateBankRequest) {
  return new Promise<boolean | ErrorType>((resolve) => {
    const db = getFirestore(getApp());
    const bankRef = doc(db, 'bank', request.bankId);
    updateDoc(bankRef, request.changes)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        resolve({
          errorCode: error?.code,
          message: error?.message,
        } as ErrorType);
      });
  });
}

export function deleteBank(bankId: string) {
  return new Promise<boolean | ErrorType>((resolve) => {
    const db = getFirestore(getApp());
    const bankRef = doc(db, 'bank', bankId);
    deleteDoc(bankRef)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        resolve({
          errorCode: error?.code,
          message: error?.message,
        } as ErrorType);
      });
  });
}
