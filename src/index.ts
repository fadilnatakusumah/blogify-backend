import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

import { APIRoutes } from "./routes";
import { connectDB } from "./database/connectDB";
import { logger } from "./helpers/logger";
config();


// connecting database
connectDB();

// express app
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === "development") {
  app.use(cors({
    origin: `http://localhost:3000`
  }))
}

app.disable("etag")

// setup routes
app.use('/api', APIRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send(`
    <div>
      <h1>Seems like you got lost?</h1>
    </div>
  `)
});


app.listen(PORT, () => {
  logger.info(`Server running at port: ${PORT}`)
})