import mongoose from "mongoose";
import chalk from "chalk";
import { logger } from "../helpers/logger";


export const connectDB = async () => {
  try {
    logger.info("Connecting to database");
    await mongoose.connect(process.env.DATABASE_LOCAL!, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });


    logger.info(chalk.yellow(`Database connected`))
  } catch (error) {
    console.error(error);
    logger.error(chalk.yellow(`Failed to connect database`));
  }
}