import { Request, Response, Router } from "express";

export const APIRoutes = Router();

APIRoutes.use('/', (req: Request, res: Response) => {
  res.send(`
    <div>
      <h1>Seems like you got lost?</h1>
    </div>
  `)
})