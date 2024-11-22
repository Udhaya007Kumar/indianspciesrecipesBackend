import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import dotenv from "dotenv";

dotenv.config();



const usermiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;   
        if (!token) {
            return res.status(401).json({ message: "Unauthorized No token Provided" });
        }   
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){    
            return res.status(401).json({ message: "Unauthorized Invalid Token" });
        }
        const user = await User.findById(decoded.userId);
        if(!user){
            return res.status(401).json({ error: " user not Found" });
        }
        req.user = user;
        next();  
    } catch (error) {
        console.log(`Error in user middleware : ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export default usermiddleware;