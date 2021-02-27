import { Router } from "express";
import { authMiddleware, requireSignin } from "../controllers/auth";
import { createBlog, listBlogs } from "../controllers/blog";

export const BlogRoutes = Router();

BlogRoutes.post('/create', requireSignin, authMiddleware, createBlog);
BlogRoutes.get('/list', listBlogs);
