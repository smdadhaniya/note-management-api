import { Request } from "express";
import { User } from "../models/users/user";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
