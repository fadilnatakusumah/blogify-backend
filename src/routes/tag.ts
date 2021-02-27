import { Router } from "express";

import { authMiddleware, requireSignin } from "../controllers/auth";
import { createTags, listTags } from "../controllers/tag";

export const TagRoutes = Router();

TagRoutes.post('/create', requireSignin, authMiddleware, createTags);
TagRoutes.get('/list', listTags);