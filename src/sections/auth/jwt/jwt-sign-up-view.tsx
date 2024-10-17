'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { signUp } from 'src/auth/context/jwt';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod
  .object({
    username: zod
      .string()
      .min(1, { message: 'Username is required!' })
      .min(6, { message: 'Username must be at least 6 characters!' }),
    firstName: zod.string().min(1, { message: 'First name is required!' }),
    lastName: zod.string().min(1, { message: 'Last name is required!' }),
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Email must be a valid email address!' }),
    password: zod
      .string()
      .min(1, { message: 'Password is required!' })
      .min(8, { message: 'Password must be at least 8 characters!' }),
    rePassword: zod.string().min(1, { message: 'Password is required!' }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'Passwords do not match!',
    path: ['rePassword'],
  });

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { checkUserSession } = useAuthContext();

  const password = useBoolean();
  const rePassword = useBoolean();

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    username: 'vandybear',
    firstName: 'Sean',
    lastName: 'McHale',
    email: 'smchaleer9@gmail.com',
    password: 'testing1234',
    rePassword: 'testing1234',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp(
        {
          username: data.username,
          email: data.email,
          password: data.password,
          first_name: data.firstName,
          last_name: data.lastName,
          re_password: data.rePassword,
        },
        setSuccessMsg,
        setErrorMsg
      );
      await checkUserSession?.();
    } catch (error) {
      // console.error(error);
      // setErrorMsg(error instanceof Error ? error.message : error);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?
        </Typography>

        <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="username" label="Username" InputLabelProps={{ shrink: true }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Field.Text name="firstName" label="First name" InputLabelProps={{ shrink: true }} />
        <Field.Text name="lastName" label="Last name" InputLabelProps={{ shrink: true }} />
      </Stack>

      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <Field.Text
        name="password"
        label="Password"
        placeholder="8+ characters"
        type={password.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Field.Text
        name="rePassword"
        label="Retype Password"
        placeholder="8+ characters"
        type={rePassword.value ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={rePassword.onToggle} edge="end">
                <Iconify icon={rePassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={<CircularProgress size={24} />}
      >
        Create account
      </LoadingButton>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 3,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy policy
      </Link>
      .
    </Typography>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && !successMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && <Alert sx={{ mb: 3 }}>{successMsg}</Alert>}

      {!successMsg && (
        <Form methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </Form>
      )}

      {renderTerms}
    </>
  );
}
