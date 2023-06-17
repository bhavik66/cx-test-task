import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material';
import React from 'react';

export interface ActionsMenuProps {
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({
  onEdit,
  onView,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // Handle edit action
    onEdit();
    handleMenuClose();
  };

  const handleView = () => {
    // Handle view action
    onView();
    handleMenuClose();
  };

  const handleDelete = () => {
    // Handle delete action
    onDelete();
    handleMenuClose();
  };

  return (
    <div>
      <div style={{ cursor: 'pointer' }} onClick={handleMenuOpen}>
        <MoreVertIcon style={{ marginRight: 10 }} />
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleView}>View</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default ActionsMenu;
