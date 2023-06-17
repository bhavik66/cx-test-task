import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} keepMounted={false}>
      <DialogTitle>{t('banksPage.form.delete')}</DialogTitle>
      <DialogContent>
        <Typography>{t('banksPage.form.deleteBankConfirmation')}</Typography>
        <Typography>
          {t('banksPage.form.deleteBankConfirmationMessage')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('banksPage.form.cancel')}</Button>
        <Button onClick={onDelete}>{t('banksPage.form.yesDeleteNow')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
