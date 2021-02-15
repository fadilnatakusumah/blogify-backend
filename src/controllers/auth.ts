import { NextFunction, Request, Response } from "express";
import shortId from "shortid";
import jwt from "jsonwebtoken";
import expressJWT, { secretType } from "express-jwt";
import { config } from "dotenv";

import { customMongoErrorHandler } from "../helpers/errorHandler";
import { User } from "../models/user";

config();

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

export const requireSignin = expressJWT({
  secret: process.env.JWT_SECRET! as secretType,
  algorithms: ["HS256"]
});


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authUserId = (req as any).user.id;
  if (!authUserId) {
    return res.status(403).json({
      success: false,
      message: "unauthorized"
    });
  }

  try {
    const user = await User.findById(authUserId);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "unauthorized"
      });
    }

    (req as any).profile = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: customMongoErrorHandler(error) || "unauthorized",
    });
  }
}