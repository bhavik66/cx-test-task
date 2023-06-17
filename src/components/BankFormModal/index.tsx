import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import React from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { banksOperations, banksSelectors } from '../../state/ducks/banks';
import { Controller, useForm } from 'react-hook-form';
import { BankType, UpdateBankRequest } from '../../types';
import { isSPError } from '../../utils/errors';
import { enqueueSnackbar } from 'notistack';

export interface BankFormModalDataType {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchAddress: string;
  contactNumber: string;
}

export interface BankFormModalProps {
  open: boolean;
  onClose: () => void;
  currentPage: number;
  isFormForEdit?: boolean;
  isReadOnly?: boolean;
}

const BankFormModal: React.FC<BankFormModalProps> = ({
  open,
  onClose,
  currentPage,
  isFormForEdit,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    bankName: yup
      .string()
      .trim()
      .required(t('banksPage.errors.requireBankName')),
    accountNumber: yup
      .string()
      .trim()
      .required(t('banksPage.errors.requireAccountNumber')),
    ifscCode: yup
      .string()
      .trim()
      .required(t('banksPage.errors.requireIfscCode')),
    branchAddress: yup
      .string()
      .trim()
      .required(t('banksPage.errors.requireBranchAddress')),
    contactNumber: yup
      .string()
      .trim()
      .required(t('banksPage.errors.requireContactNumber')),
  });
  const bankBeingAdded = useAppSelector(banksSelectors.addBank)?.bankToBeAdded;

  const isAdding = useAppSelector(banksSelectors.addBank)?.isAdding;

  const bankBeingEdited = useAppSelector(banksSelectors.editBank)?.bank;

  const isUpdating = useAppSelector(banksSelectors.editBank)?.isUpdating;

  const defaultFormValues = (): BankFormModalDataType | undefined => {
    let values: BankFormModalDataType = {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branchAddress: '',
      contactNumber: '',
    };

    if (isFormForEdit) {
      if (bankBeingEdited) {
        values = {
          bankName: bankBeingEdited.bankName,
          accountNumber: bankBeingEdited.accountNumber,
          ifscCode: bankBeingEdited.ifscCode,
          branchAddress: bankBeingEdited.branchAddress,
          contactNumber: bankBeingEdited.contactNumber,
        };
      } else {
        console.error(
          'This situation should not occur where there is no object bankBeingEdited while editing a bank.'
        );
      }
    } else {
      if (bankBeingAdded) {
        values = {
          bankName: bankBeingAdded.bankName,
          accountNumber: bankBeingAdded.accountNumber,
          ifscCode: bankBeingAdded.ifscCode,
          branchAddress: bankBeingAdded.branchAddress,
          contactNumber: bankBeingAdded.contactNumber,
        };
      }
    }

    return values;
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<BankFormModalDataType>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...defaultFormValues(),
    },
  });

  const onSubmit = (data: BankFormModalDataType) => {
    if (isFormForEdit) {
      if (!bankBeingEdited) {
        console.error(
          'Unexpected case: We have reached a point which should not happen. Needs to be checked and fixed in code.'
        );
        return;
      }

      if (isDirty) {
        const newBankObject: BankType = {
          bankName: data.bankName.trim(),
          accountNumber: data.accountNumber.trim(),
          ifscCode: data.ifscCode.trim(),
          branchAddress: data.branchAddress.trim(),
          contactNumber: data.contactNumber.trim(),
        };

        const changesInUpdateRequest: UpdateBankRequest['changes'] = {
          bankName: data.bankName.trim(),
          accountNumber: data.accountNumber.trim(),
          ifscCode: data.ifscCode.trim(),
          branchAddress: data.branchAddress.trim(),
          contactNumber: data.contactNumber.trim(),
        };

        if (bankBeingEdited.bankId) {
          dispatch(
            banksOperations.updateBankDetails({
              newBankObject,
              updateRequest: {
                bankId: bankBeingEdited.bankId,
                changes: {
                  ...changesInUpdateRequest,
                },
              },
            })
          )
            .unwrap()
            .then((successOrError) => {
              if (isSPError(successOrError)) {
                enqueueSnackbar(t('globalErrors.errorGeneral'), {
                  variant: 'error',
                });
              } else {
                enqueueSnackbar(t('banksPage.success.updateBankDetails'), {
                  variant: 'success',
                });
                dispatch(banksOperations.resetBankEditInfo());
                dispatch(
                  banksOperations.fetchBanks({
                    page: currentPage,
                  })
                );
                onClose();
              }
            });
        } else {
          console.error(
            'Unexpected case: We have reached a point which should not happen. Needs to be checked and fixed in code.'
          );
        }
      } else {
        onClose();
      }
    } else {
      const bankToBeAdded: BankType = {
        bankName: data.bankName.trim(),
        accountNumber: data.accountNumber.trim(),
        ifscCode: data.ifscCode.trim(),
        branchAddress: data.branchAddress.trim(),
        contactNumber: data.contactNumber.trim(),
      };

      dispatch(banksOperations.addBank(bankToBeAdded))
        .unwrap()
        .then((successOrError) => {
          if (isSPError(successOrError)) {
            enqueueSnackbar(t('globalErrors.errorGeneral'), {
              variant: 'error',
            });
          } else {
            enqueueSnackbar(t('banksPage.success.addBankDetails'), {
              variant: 'success',
            });
            dispatch(banksOperations.resetBankAddInfo());
            dispatch(banksOperations.fetchBanks({ page: currentPage }));
            onClose();
          }
        })
        .catch(() => {
          enqueueSnackbar(t('globalErrors.errorGeneral'), {
            variant: 'error',
          });
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth keepMounted={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isFormForEdit
            ? t('banksPage.form.editBankInfo')
            : t('banksPage.form.addNewBank')}
        </DialogTitle>
        <DialogContent>
          <Stack pt={2}>
            <Controller
              name="bankName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  id="bankName"
                  label={t('banksPage.label.bankName')}
                  error={!!errors.bankName}
                  helperText={errors.bankName ? errors.bankName.message : ''}
                  margin={'normal'}
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              name="accountNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  id="accountNumber"
                  label={t('banksPage.label.accountNumber')}
                  error={!!errors.accountNumber}
                  helperText={
                    errors.accountNumber ? errors.accountNumber.message : ''
                  }
                  margin={'normal'}
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              name="ifscCode"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  id="ifscCode"
                  label={t('banksPage.label.ifscCode')}
                  error={!!errors.ifscCode}
                  helperText={errors.ifscCode ? errors.ifscCode.message : ''}
                  margin={'normal'}
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              name="branchAddress"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  id="branchAddress"
                  label={t('banksPage.label.branchAddress')}
                  error={!!errors.branchAddress}
                  helperText={
                    errors.branchAddress ? errors.branchAddress.message : ''
                  }
                  margin={'normal'}
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              name="contactNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  id="contactNumber"
                  label={t('banksPage.label.contactNumber')}
                  error={!!errors.contactNumber}
                  helperText={
                    errors.contactNumber ? errors.contactNumber.message : ''
                  }
                  margin={'normal'}
                  fullWidth
                  {...field}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          {isAdding || isUpdating ? (
            <Stack px={4} pb={2}>
              <CircularProgress size={30} />
            </Stack>
          ) : (
            <>
              <Button variant="contained" onClick={onClose}>
                {t('banksPage.form.cancel')}
              </Button>
              <Button variant="contained" type="submit">
                {isFormForEdit
                  ? t('banksPage.form.update')
                  : t('banksPage.form.addBank')}
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BankFormModal;
