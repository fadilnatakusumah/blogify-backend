import { Request, Response, Router } from "express";
import { AuthRoutes } from "./auth";
import { BlogRoutes } from "./blog";
import { TagRoutes } from "./tag";

export const APIRoutes = Router();

APIRoutes.use('/auth', AuthRoutes);
APIRoutes.use('/blog', BlogRoutes);
APIRoutes.use('/tag', TagRoutes);

APIRoutes.use('/', (req: Request, res: Response) => {
  res.send(`
    <div>
      <h1>Seems like you got lost?</h1>
    </div>
  `)
})
