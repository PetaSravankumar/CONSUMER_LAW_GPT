// src/utils/checkTokenExpiry.ts
export const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return now > expiry;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Treat as expired if any error occurs
    }
  };
  