import express, { Request, Response } from "express";
import { userValidationSchema } from "../../validation/user";
import bcrypt from "bcryptjs";
import { User } from "../../models/users/user";
import JWT from "jsonwebtoken";

const router = express.Router();

const hashPassword = async (password: string) => {
  if (!password) throw new Error("Password is missing");
  try {
    const encryptPassword = await bcrypt.hash(password, 10);
    return encryptPassword;
  } catch (error) {
    throw new Error("Error while hashing the password");
  }
};

const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const { email, password } = req.body;

    const encryptPassword = await hashPassword(password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    const user = new User({ email, password: encryptPassword });
    await user.save();

    const token = JWT.sign({ _id: user.id }, process.env.JWT_SECRET!);

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred. Please try again later.",
    });
  }
};

const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password!" });
    }

    const token = JWT.sign({ _id: existingUser.id }, process.env.JWT_SECRET!);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred. Please try again later.",
    });
  }
};

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
