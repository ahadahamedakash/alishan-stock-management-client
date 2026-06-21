import { JwtPayload } from "jsonwebtoken";

// Extend JwtPayload with our custom properties
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
  email: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user: CustomJwtPayload;
    }
  }
}
