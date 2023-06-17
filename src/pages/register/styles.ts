import { Box, SxProps } from '@mui/material';
import styled from 'styled-components';

const Container = styled(Box)`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const styledForForm: SxProps = {
  display: 'flex',
  flexDirection: 'column',
};

const styledForInput: SxProps = {
  marginBottom: '1rem',
};

export { Container, styledForForm, styledForInput };
