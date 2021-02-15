import { Router } from "express";
import { authMiddleware, requireSignin } from "../controllers/auth";
import { createBlog } from "../controllers/blog";


export const BlogRoutes = Router();

BlogRoutes.post('/create', requireSignin, authMiddleware, createBlog);