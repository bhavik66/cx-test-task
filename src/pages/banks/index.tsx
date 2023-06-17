import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import {
  BankDetails,
  BankFormModal,
  BankListView,
  ConfirmationModal,
} from '../../components';
import { useAppDispatch } from '../../hooks';
import { banksOperations } from '../../state/ducks/banks';
import { isSPError } from '../../utils/errors';

import * as s from './styles';
import { authOperations } from '../../state/ducks/auth';
import { useTranslation } from 'react-i18next';

const Banks = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFormForEdit, setFormForEdit] = useState(false);
  const [bankDetailsOpen, setBankDetailsOpen] = useState(false);
  const [bankDeleteId, setBankDeleteId] = useState<string | undefined>();

  const [searchText, setSearchText] = React.useState<string>('');

  const handleAddBank = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFormForEdit(false);
    setBankDetailsOpen(false);
    setBankDeleteId(undefined);
    setOpen(false);
  };

  const handleEdit = (bankId: string) => {
    setFormForEdit(true);
    dispatch(banksOperations.fetchBankDetails(bankId))
      .unwrap()
      .then((data) => {
        if (!isSPError(data)) {
          setOpen(true);
        }
      });
  };

  const handleView = (bankId: string) => {
    dispatch(banksOperations.fetchBankDetails(bankId))
      .unwrap()
      .then((data) => {
        if (!isSPError(data)) {
          setBankDetailsOpen(true);
        }
      });
  };

  const handleDelete = (bankId: string) => {
    setBankDeleteId(bankId);
  };

  const handleDeleteBank = () => {
    if (bankDeleteId) {
      dispatch(banksOperations.deleteBank(bankDeleteId))
        .unwrap()
        .then(() => {
          handleClose();
          dispatch(banksOperations.fetchBanks({ page: currentPage }));
        });
    }
  };

  const handleLogout = () => {
    dispatch(authOperations.logout());
  };

  const handleSearch = () => {
    if (searchText) {
      setCurrentPage(0);
      dispatch(banksOperations.fetchBanks({ page: 0, searchText }));
    } else {
      dispatch(banksOperations.fetchBanks({ page: 0 }));
    }
  };

  return (
    <s.Container>
      <Grid container mb={2} spacing={2}>
        <Grid sm={6} item container spacing={2}>
          <Grid item>
            <TextField
              size="small"
              placeholder={t('banksPage.label.search')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleSearch}>
              {t('banksPage.label.search')}
            </Button>
          </Grid>
        </Grid>
        <Grid
          sm={6}
          item
          container
          justifyContent={{
            sm: 'flex-end',
          }}
          spacing={2}
        >
          <Grid item>
            <Button variant="contained" onClick={handleAddBank}>
              {t('banksPage.form.addNewBank')}
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleLogout}>
              {t('authPage.label.logout')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <BankListView
        onChangePage={(page: number) => setCurrentPage(page)}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />
      {open && (
        <BankFormModal
          open={open}
          onClose={handleClose}
          currentPage={currentPage}
          isFormForEdit={isFormForEdit}
        />
      )}
      {bankDetailsOpen && (
        <BankDetails open={bankDetailsOpen} onClose={handleClose} />
      )}
      {!!bankDeleteId && (
        <ConfirmationModal
          open={!!bankDeleteId}
          onClose={handleClose}
          onDelete={handleDeleteBank}
        />
      )}
    </s.Container>
  );
};

export default Banks;
