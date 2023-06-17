import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks';
import { banksSelectors } from '../../state/ducks/banks';

export interface BankDetailsProps {
  open: boolean;
  onClose: () => void;
}

const BankDetails: React.FC<BankDetailsProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const bankBeingEdited = useAppSelector(banksSelectors.editBank)?.bank;

  return (
    <Dialog open={open} onClose={onClose} fullWidth keepMounted={false}>
      <DialogTitle>{t('banksPage.label.bankDetails')}</DialogTitle>
      <DialogContent>
        <Stack pt={2} spacing={2}>
          <Stack>
            <Typography variant="subtitle2">
              {t('banksPage.label.bankName')}
            </Typography>
            <Typography>{bankBeingEdited?.bankName}</Typography>
          </Stack>
          <Stack>
            <Typography variant="subtitle2">
              {t('banksPage.label.accountNumber')}
            </Typography>
            <Typography>{bankBeingEdited?.accountNumber}</Typography>
          </Stack>
          <Stack>
            <Typography variant="subtitle2">
              {t('banksPage.label.ifscCode')}
            </Typography>
            <Typography>{bankBeingEdited?.ifscCode}</Typography>
          </Stack>
          <Stack>
            <Typography variant="subtitle2">
              {t('banksPage.label.branchAddress')}
            </Typography>
            <Typography>{bankBeingEdited?.branchAddress}</Typography>
          </Stack>
          <Stack>
            <Typography variant="subtitle2">
              {t('banksPage.label.contactNumber')}
            </Typography>
            <Typography>{bankBeingEdited?.contactNumber}</Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BankDetails;
