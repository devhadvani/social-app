import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const checkTokenExpiration = (token) => {
  if (!token) return false;
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
    }
    if (token && checkTokenExpiration(token)) {
      localStorage.removeItem('token');
      navigate('/login');
    }

  }, [navigate]);
};

export default useAuthCheck;
