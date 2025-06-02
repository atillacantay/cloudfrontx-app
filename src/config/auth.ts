export const createBasicAuthHeader = (): string => {
  const authorization_token = localStorage.getItem("authorization_token");
  if (!authorization_token) return "";

  return `Basic ${authorization_token}`;
};

export const isAuthError = (status: number): boolean => {
  return status === 401 || status === 403;
};

export const getAuthErrorMessage = (status: number): string => {
  switch (status) {
    case 401:
      return "Authentication failed: Invalid or missing credentials";
    case 403:
      return "Access forbidden: You do not have permission to perform this action";
    default:
      return "Authentication error occurred";
  }
};
