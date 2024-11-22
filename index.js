import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./Router/authRouter.js";
import recipeRouter from "./Router/recipeRouter.js";
import userRouter from "./Router/userRouter.js";
import { connect } from "mongoose";
import connectDb from "./Database/Dbconfiq.js";
import cookieParser from 'cookie-parser';
import cloudinary from "cloudinary";



dotenv.config();

const app = express();



// Use cookie-parser middleware
app.use(cookieParser());

app.use(
    cors({
        origin: 'https://indianspciesrecipesfd.vercel.app', // React frontend URL
        credentials: true, // Allow credentials (cookies) to be sent
    })
);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });



app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb"}));



app.use("/api/auth",authRouter);
app.use("/api/recipe",recipeRouter);
app.use("/api/user",userRouter);


app.get("/", (req, res) => {
    res.send("Hello World!");
}); 



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
    connectDb();
});