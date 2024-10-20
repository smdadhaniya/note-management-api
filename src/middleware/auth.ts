import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";

interface JWTPayload {
  id: string;
  username: string;
}
export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
): any => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (token) {
      const jwtSecret = process.env.JWT_SECRET!;
      JWT.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) {
          return res.status(403).send({ success: false, message: err });
        }
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Invalid token" });
  }
};
