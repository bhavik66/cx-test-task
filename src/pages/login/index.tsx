import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Container,
  Stack,
  CircularProgress,
} from '@mui/material';
import { AuthType } from '../../types';
import * as s from './styles';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks';
import { authOperations } from '../../state/ducks/auth';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '../../constants';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isServerLoading, setServerLoading] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(t('authPage.errors.invalidEmail'))
      .required(t('authPage.errors.requireEmail')),
    password: yup
      .string()
      .required(t('authPage.errors.requirePassword'))
      .min(6, t('authPage.errors.minPassword')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthType>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: AuthType) => {
    setServerLoading(true);
    dispatch(authOperations.login(data))
      .then(() => {
        setServerLoading(false);
        navigate(appRoutes.BANKS);
      })
      .catch(() => {
        setServerLoading(false);
        enqueueSnackbar(t('authPage.errors.somethingWentWrong'), {
          variant: 'error',
        });
      });
  };

  const handleRegister = () => {
    navigate(appRoutes.REGISTER);
  };

  return (
    <s.Container>
      <Container maxWidth={'xs'}>
        <h1>{t('authPage.label.login')}</h1>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={s.styledForForm}
        >
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label={t('authPage.label.email')}
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={s.styledForInput}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label={t('authPage.label.password')}
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={s.styledForInput}
              />
            )}
          />
          {isServerLoading ? (
            <Box
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
            >
              <CircularProgress size={30} />
            </Box>
          ) : (
            <Stack spacing={2}>
              <Button type="submit" variant="contained">
                {t('authPage.label.login')}
              </Button>
              <Button variant="text" onClick={handleRegister}>
                {t('authPage.label.gotoRegister')}
              </Button>
            </Stack>
          )}
        </Box>
      </Container>
    </s.Container>
  );
};

export default Login;
