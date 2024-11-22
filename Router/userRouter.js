import express from "express";
import {getprofile,updateUser,updatecoverimage,updateProfileimage,SingleuserAllRcipelist} from "../Controllers/userController.js";
import usermiddleware from "../Middleware/userMiddleware.js";



const router = express.Router();


router.get("/profile/:id",usermiddleware,getprofile);
router.post("/update/:id",usermiddleware,updateUser) 
router.post("/updatecoverimage",usermiddleware,updatecoverimage) 
router.post("/updateprofileimage",usermiddleware,updateProfileimage) 
router.post("/userrecipe/:id",usermiddleware,SingleuserAllRcipelist)

export default router;