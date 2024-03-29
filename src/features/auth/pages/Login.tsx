import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CircularProgress } from '@mui/material';

// Store
import { submitLogin } from './../AuthSlice';
import { selectErrors, selectStatus } from './../AuthSlice';

// constant
import { Status } from '../../../enum/requestStatus';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email.').required('Please enter your email.'),
  password: yup.string().required('Please enter your password.'),
});


type FormData = {
  email: string
  password: string
}

const defaultValues: FormData = {
  email: '',
  password: '',
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageError = useSelector(selectErrors);
  const status = useSelector(selectStatus);

  const { control, formState, handleSubmit, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    messageError?.forEach((error) => {
      setError(error.type, {
        type: 'manual',
        message: error.message,
      });
    });

    if(status === Status.SUCCESS) {
      navigate('/');
    };
  }, [messageError, setError, dispatch, status]);

  function onSubmit(model: FormData) {
    dispatch(submitLogin(model));
  }

  return (
    <div className="w-2/5 pt-20 m-auto shadow-md">
      <form className="flex flex-col justify-center w-full " onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="m-10"
              type="text"
              error={!!errors.email}
              helperText={errors?.email?.message || ' '}
              label="Email"
              InputProps={{
                className: 'pr-2',
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="m-10"
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors?.password?.message || ' '}
              variant="outlined"
              InputProps={{
                className: 'pr-2',
                type: showPassword ? 'text' : 'password',
                endAdornment: (
                  <InputAdornment onClick={() => setShowPassword(!showPassword)} position="end" className="cursor-pointer">
                    <VisibilityIcon />
                  </InputAdornment>
                ),
              }}
              required
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto m-10"
          aria-label="LOG IN"
          // disabled={_.isEmpty(dirtyFields) || !isValid || login.status === 'pending'}
          value="legacy"
        >
          {status !== Status.PENDING && 'Login'}
          {status === Status.PENDING && <CircularProgress size={22} />}
        </Button>
      </form>
    </div>
  );
}

export default Login;
