import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { Navigate } from 'react-router-dom';
import {
  getError,
  getUserState,
  loginUser
} from '../../services/slices/userSlice/userSlice';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const error = useSelector(getError);
  const { isAuthenticated } = useSelector(getUserState);
  const dispatch = useDispatch();

  const { values, handleChange } = useForm({ email: '', password: '' });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const { email, password } = values;
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <LoginUI
      errorText={error?.toString()}
      email={values.email}
      setEmail={(val) =>
        handleChange({ target: { name: 'email', value: val } } as any)
      }
      password={values.password}
      setPassword={(val) =>
        handleChange({ target: { name: 'password', value: val } } as any)
      }
      handleSubmit={handleSubmit}
    />
  );
};
