import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import Loading from './Loading';
import axios from 'axios';

export default function UserReadOnlyRoute() {
  const [auth] = useAuth();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const userCheck = async () => {
      try {
        // Verifies user is authenticated (Admin or regular store staff)
        // later whene backend /user-check available 
      // const { data } = await axios.get('/user-check');
        const { data } = await axios.get('/auth-check');
        if (data?.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch {
        setOk(false);
      }
    };
    if (auth?.token) userCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Loading path="" />;
}