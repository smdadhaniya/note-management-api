import express, { Request, Response } from "express";
import { userValidationSchema } from "../../validation/user";
import bcrypt from "bcryptjs";
import { User } from "../../models/users/user";
import JWT from "jsonwebtoken";
const router = express.Router();

const hashPassword = async (password: string) => {
  if (!password) throw new Error("password is missing");
  try {
    const encryptPassword = await bcrypt.hash(password, 10);
    return encryptPassword;
  } catch (error) {
    console.log("error", error);
  }
};

const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error?.details[0].message;
    return res.status(400).send({ success: false, message: errorMessage });
  }

  const { email, password } = req.body;
  const encryptPassword = await hashPassword(password);
  const user = new User({ email, password: encryptPassword });
  const token = JWT.sign({ _id: user.id }, process.env.JWT_SECRET!);
  await user.save();
  res
    .status(200)
    .send({
      success: true,
      message: "User register successfully",
      user,
      token,
    });
};

const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    const errorMessage = error?.details[0].message;
    return res.status(400).send({ success: false, message: errorMessage });
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) return res.status(400).send("User not found!");

  const validPassword = await bcrypt.compare(password, existingUser.password);
  if (!validPassword) return res.status(400).send("password is not valid!");

  const token = JWT.sign({ _id: existingUser.id }, process.env.JWT_SECRET!);
  res
    .status(200)
    .send({ success: true, message: "User logged in successfully", token });
};

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
