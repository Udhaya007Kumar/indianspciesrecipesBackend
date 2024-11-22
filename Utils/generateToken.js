import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();



const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });

    res.cookie("jwt", token, {
        httpOnly: true, // Prevents access to cookie via client-side scripts
        maxAge: 15 * 24 * 60 * 60 * 1000, // Corrected maxAge (15 days in milliseconds)
        sameSite: "None", // Set to "None" for cross-origin requests
        secure: process.env.NODE_ENV === "production", // Secure only in production
    });
};

export default generateToken;