import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../Utils/generateToken.js";




//sinup

/**
 * @api {post} /api/auth/signup
 * @apiName Signup
 * @apiGroup Auth
 * @apiDescription Creates a new user and returns a JWT token
 * @apiParam {String} username Username of the user
 * @apiParam {String} fullname Fullname of the user
 * @apiParam {String} email Email address of the user
 * @apiParam {String} password Password of the user
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       message: "User created successfully",
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       message: "Email or username already exists",
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       message: "Password must be at least 6 characters",
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       error: "Internal Server Error",
 *     }
 */
export const authSingup = async (req, res) => {
   try {
      const { username, fullname, email, password } = req.body;
      const emailReqex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailReqex.test(email)){
         return res.status(400).json({message:"Invalid email"});
      }
      const exitingEmail =await User.findOne({email});
      const exitingUsername =await User.findOne({username});
      if(exitingEmail || exitingUsername){
         return res.status(400).json({message:"Email or username already exists"});
      }
      if(password.length < 6){   
         return res.status(400).json({message:"Password must be at least 6 characters"});
      }
      //hassing passord
      const salt =await bcrypt.genSalt(10);
      const hashedPassword =await bcrypt.hash(password, salt); 
    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
    });
    if(newUser){
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({message:"User created successfully"});
    }
    else{
      res.status(400).json({ error: "Internal user Data" });
    } 
   } catch (error) {
      console.log(`Error in singup Controller : ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
   }
}


//Login page

export const authLogin =async (req, res) => {
   try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      const ispasswordmatch = await bcrypt.compare(password, user.password || "");
      if(!user || !ispasswordmatch){
         return res.status(400).json({message:"User not found"}); 
      }
      generateToken(user._id, res);
      res.status(200).json({message:"User logged in successfully"});

      
   } catch (error) {
      console.log(`Error in singup Controller : ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

export const authLogout =async (req, res) => {
   try {
      res.cookie("jwt", "", { maxAge: 0});
    res.status(200).json({ message: "Logout Successfull" });     
   } catch (error) {
      console.log(`Error in Logout Controller : ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
   }
}


export const allUserList =async (req, res) => {
   try {
      const users = await User.find();
      res.status(200).json({message:"User found successfully",users});  
   } catch (error) {
      console.log(`Error in AllUser Controller : ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
   }
}

export const userList =async (req, res) => {
   try {
      const user =await User.findOne({_id:req.user._id}).select("-password");
      if (!user) {
         return res.status(404).json({ error: "User not found" });
     }
        res.status(200).json({ user });  
   } catch (error) {
      console.log(`Error in userList Controller : ${error}`);
      res.status(500).json({ error: "Internal Server Error" });  
   }
}

