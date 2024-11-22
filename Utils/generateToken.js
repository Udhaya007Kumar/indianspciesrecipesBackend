import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();



const generateToken = (userId,res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
    
    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "production"
    });
}

export default generateToken;