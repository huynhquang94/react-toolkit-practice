import { Controller, useForm } from 'react-hook-form';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const defaultValues = {
  email: '',
  password: '',
};

function Login() {
  const passwordMinLength = 4;
  const regexUserNameOrEmail = /^(?:(\w+([\.-]?\w+))|(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})))$/;

  const schema = yup.object().shape({
    email: yup
      .string()
      .required('You must enter a user name or email.')
      .matches(regexUserNameOrEmail, 'You must enter a valid user name or email.'),
    password: yup
      .string()
      .required('Please enter your password.')
      .min(
        passwordMinLength,
        `Password is too short - should be ${passwordMinLength} chars minimum.`
      ),
  });

  const { control, setValue, formState, handleSubmit, getValues } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  return (
    <div className="w-full">
      <form className="flex flex-col justify-center w-full">
        <figure className="w-[75%] mx-auto pb-36">
        </figure>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-16"
              type="text"
              label="Email"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* <Icon className="text-20" color="action">
                      user
                    </Icon> */}
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-16"
              label="Password"
              type="password"
              variant="outlined"
              InputProps={{
                className: 'pr-2',
                type: 'password',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="large">
                      {/* <Icon className="text-20" color="action">
                        { 'visibility_off'}
                      </Icon> */}
                    </IconButton>
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
          className="w-full mx-auto mt-16"
          aria-label="LOG IN"
          value="legacy"
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
