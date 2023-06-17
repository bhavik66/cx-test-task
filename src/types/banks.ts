export interface BankType {
  bankId?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchAddress: string;
  contactNumber: string;
}

export interface GetBanksResponse {
  totalCount: number;
  banks: BankType[];
}
export interface AddBankRequest {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchAddress: string;
  contactNumber: string;
}

export interface UpdateBankRequest {
  bankId: string;
  changes: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchAddress: string;
    contactNumber: string;
  };
}
