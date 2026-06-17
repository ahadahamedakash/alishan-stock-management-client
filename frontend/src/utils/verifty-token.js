import { jwtDecode } from 'jwt-decode';

// ----------------------------------------------------------------------

export const verifyToken = async (token) => {
  return jwtDecode(token);
};
