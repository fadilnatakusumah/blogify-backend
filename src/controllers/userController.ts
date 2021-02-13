import { Request, Response } from "express";
import { customMongoErrorHandler } from "../helpers/errorHandler";
import { User } from "../models/user";
import shortId from "shortid";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: 'user with that email is already exist'
      });
    }

    const newUser = new User({
      name,
      username: shortId.generate(),
      email,
      password,
    })

    await newUser.save();

    res.json({
      success: true,
      message: 'success create user',
      data: newUser
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: customMongoErrorHandler(error),
    });
  }
}

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'user with that email is not exist'
      });
    }

    const isValid = (user as any).authenticate(password);
    console.log("🚀 ~ file: userController.ts ~ line 55 ~ signIn ~ password", password)
    console.log("🚀 ~ file: userController.ts ~ line 53 ~ signIn ~ isValid", isValid)
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'email and password does not match'
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '3d' }
    );

    res.cookie('token', token, { expires: new Date(Date.now() + 90000) })

    res.json({
      success: true,
      data: { token, ...user.toJSON() }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: customMongoErrorHandler(error),
    });
  }
}