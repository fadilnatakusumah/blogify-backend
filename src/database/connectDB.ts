import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to database");
    await mongoose.connect(process.env.DATABASE_LOCAL!, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log(`Database connected 🚀 `)
  } catch (error) {
    console.error(error);
    console.log("Failed to connect database");
  }
}