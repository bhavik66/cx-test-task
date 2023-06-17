import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { banksOperations, banksSelectors } from '../../state/ducks/banks';
import ActionsMenu from '../ActionsMenu';
import { config } from '../../constants';

export interface BankListViewProps {
  onChangePage: (page: number) => void;
  onEdit: (bankId: string) => void;
  onView: (bankId: string) => void;
  onDelete: (bankId: string) => void;
}

const BankListView: React.FC<BankListViewProps> = ({
  onChangePage,
  onEdit,
  onView,
  onDelete,
}) => {
  const dispatch = useAppDispatch();

  const { banks, isLoading, totalCount } = useAppSelector(
    banksSelectors.banksList
  );

  const [page, setPage] = React.useState(0);

  React.useEffect(() => {
    dispatch(banksOperations.fetchBanks({ page: 0 }));
  }, []);

  React.useEffect(() => {
    dispatch(banksOperations.pageNumberChangedForBanksList(page));
    dispatch(banksOperations.fetchBanks({ page }));
    onChangePage(page);
  }, [page]);

  const handlePageChange = (params: GridPaginationModel) => {
    setPage(params.page);
  };

  const columns: GridColDef[] = [
    {
      field: 'bankName',
      headerName: 'Bank',
      width: 150,
    },
    {
      field: 'accountNumber',
      headerName: 'Account Number',
      width: 150,
    },
    {
      field: 'ifscCode',
      headerName: 'IFSC Code',
      width: 150,
    },
    {
      field: 'branchAddress',
      headerName: 'Branch Address',
      width: 200,
    },
    {
      field: 'contactNumber',
      headerName: 'Contact Number',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <ActionsMenu
          onEdit={() => onEdit(params.row.bankId)}
          onView={() => onView(params.row.bankId)}
          onDelete={() => onDelete(params.row.bankId)}
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <DataGrid
        loading={isLoading}
        rows={banks}
        columns={columns}
        getRowId={(row) => row.bankId}
        rowCount={totalCount}
        onPaginationModelChange={handlePageChange}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: config.TABLE_ROW_PER_PAGE,
            },
          },
        }}
        pageSizeOptions={[config.TABLE_ROW_PER_PAGE]}
        paginationMode="server"
      />
    </Box>
  );
};

export default BankListView;
