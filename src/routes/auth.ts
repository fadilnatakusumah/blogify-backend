import { Router } from "express";

import { signIn, signUp } from "../controllers/auth";
import { runValidators } from "../validators";
import { signUpValidator } from "../validators/auth";

export const AuthRoutes = Router();

AuthRoutes.post('/signup', signUpValidator, runValidators, signUp);
AuthRoutes.post('/signin', signIn);
