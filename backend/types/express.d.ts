import { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: DefaultJwtPayload & {
        id: string;
        email?: string; // Add more fields from your JWT if needed
      };
    }
  }
}
